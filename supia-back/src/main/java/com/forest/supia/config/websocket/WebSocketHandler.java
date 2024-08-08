package com.forest.supia.config.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class WebSocketHandler extends TextWebSocketHandler {

    //clients라는 변수에 세션을 담아두기 위한 맵형식의 공간
    private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();

    private List<WebSocketSession> sessions = new LinkedList<WebSocketSession>();

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;
    private final ObjectMapper objectMapper;

    //websocket handshake가 완료되어 연결이 수립될 때 호출
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("My Session : " + session.getId());
        System.out.println("after connection established, Current Users : "+sessions.toArray());
    }

    //websocket 세션 연결이 종료되었을 때 호출
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);

        //만약 세션에 접속한 인원이 0명이라면 클라이언트 해시맵 비워주기
        if(sessions.size()==0){
            CLIENTS.clear();
        }
    }

    //websocket session 으로 메시지가 수신되었을 때 호출
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String payload = message.getPayload();
        System.out.println("handle text Message : "+payload);
        System.out.println("WebSocketSession :" + session);

        Map<String, String> data = objectMapper.readValue(payload, Map.class);
        System.out.println("Message Type : " + data.get("type"));

        String id = "";

        if ("authenticate".equals(data.get("type"))) {
            System.out.println("authenticate check");
            String token = data.get("token");
            token = token.substring(7);

            Long memberId = jwtUtil.extractMemberId(token);
            Member member = memberRepository.findById(memberId).orElse(null);
            if (member != null && jwtUtil.validateToken(token, member)) {
                id = String.valueOf(memberId);
                CLIENTS.put(id, session);
                session.sendMessage(new TextMessage("{\"type\": \"authenticated\"}"));
                System.out.println(objectMapper.writeValueAsString("Clients List : " + CLIENTS.keySet()));

            } else {
                session.sendMessage(new TextMessage("{\"type\": \"error\", \"message\": \"Invalid token\"}"));
                session.close();
            }
        } else if ("message".equals(data.get("type"))) {
            System.out.println("Message received: " + data.get("message"));

            //메세지가 보내면 자기자신을 제외한 전체에게 broadcasting
//            CLIENTS.entrySet().forEach( arg->{
//                if(!arg.getKey().equals(id)) {  //같은 아이디가 아니면 메시지를 전달합니다.
//                    try {
//                        arg.getValue().sendMessage(message);
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//                }
//            });

            for(String memberId : CLIENTS.keySet()){
                if(memberId.equals(id)){
                    try{
                        CLIENTS.get(memberId).sendMessage(message);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        } else if ("offer".equals(data.get("type")) || "answer".equals(data.get("type")) || "ice-candidate".equals(data.get("type"))) {

            String targetUserId = data.get("targetUserId");
            String fromUserId = data.get("fromUserId");
            System.out.println("before data keyset print");
            System.out.println(data.keySet());

            for(String memberId : CLIENTS.keySet()){
                if("offer".equals(data.get("type")) && memberId.equals(targetUserId)){
                    try{
                                TextMessage ms = new TextMessage("{"
                                + "\"type\": \"" + data.get("type") + "\", "
                                + "\"targetUserId\": \"" + targetUserId + "\", "
                                + "\"fromUserId\": \"" + fromUserId + "\", "
                                + "\"offer\" : " + objectMapper.writeValueAsString(data.get("offer")) +","
                                + "\"answer\" : " + objectMapper.writeValueAsString(data.get("answer")) +","
                                + "\"candidate\" : " + objectMapper.writeValueAsString(data.get("candidate"))
                                + "}");
                        CLIENTS.get(memberId).sendMessage(
                                ms);
                        System.out.println("Offer To User Id : "+data.get("targetUserId"));
                        System.out.println("Offer Message : "+ms.getPayload());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                else if("answer".equals(data.get("type")) && memberId.equals(targetUserId)){
                    try{
                        TextMessage ms = new TextMessage("{"
                                + "\"type\": \"" + data.get("type") + "\", "
                                + "\"targetUserId\": \"" + targetUserId + "\", "
                                + "\"fromUserId\": \"" + fromUserId + "\", "
                                + "\"offer\" : " + objectMapper.writeValueAsString(data.get("offer")) +","
                                + "\"answer\" : " + objectMapper.writeValueAsString(data.get("answer")) +","
                                + "\"candidate\" : " + objectMapper.writeValueAsString(data.get("candidate"))
                                + "}");
                        CLIENTS.get(memberId).sendMessage(
                                ms);
                        System.out.println("Answer to UserId : " + fromUserId);
                        System.out.println("Answer Message : "+ms.getPayload());
                        System.out.println("answer보냄");
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

//            for(String memberId : CLIENTS.keySet()){
//                if("offer".equals(data.get("type")) && !memberId.equals(id)){
//                    try{
//                        TextMessage ms = new TextMessage("{"
//                                + "\"type\": \"" + data.get("type") + "\", "
//                                + "\"targetUserId\": \"" + targetUserId + "\", "
//                                + "\"offer\" : \"" + objectMapper.writeValueAsString(data.getOrDefault("offer", "")) + "\", "
//                                + "\"answer\" : \"" + objectMapper.writeValueAsString(data.getOrDefault("answer", "")) + "\", "
//                                + "\"ice-candidate\" : \"" + objectMapper.writeValueAsString(data.getOrDefault("ice-candidate", "")) + "\""
//                                + "}");
//                        CLIENTS.get(memberId).sendMessage(
//                                new TextMessage("{"
//                                        + "\"type\": \"" + data.get("type") + "\", "
//                                        + "\"targetUserId\": \"" + targetUserId + "\", "
//                                        + "\"offer\" : \"" + objectMapper.writeValueAsString(data.getOrDefault("offer", "")) + "\", "
//                                        + "\"answer\" : \"" + objectMapper.writeValueAsString(data.getOrDefault("answer", "")) + "\", "
//                                        + "\"ice-candidate\" : \"" + objectMapper.writeValueAsString(data.getOrDefault("ice-candidate", "")) + "\""
//                                        + "}")
//                        );
//                        System.out.println("offer message : " + ms.getPayload());
//                        System.out.println("offer success");
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//                }
//
//                else if("answer".equals(data.get("type")) && !memberId.equals(id)){
//                    try{
//                        CLIENTS.get(memberId).sendMessage(
//                                new TextMessage("{\"type\": \""+ data.get("type") +"\", \"targetUserId\": \"" + targetUserId + "\"" +
//                                        "\"offer\" : \""+data.getOrDefault("offer", "")+"\"" +
//                                        "\"answer\" : \""+data.getOrDefault("answer", "")+"\"" +
//                                        "\"ice-candidate\" : \""+data.getOrDefault("ice-candidate", "")+"\"" +
//                                        "}")
//                        );
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//                }
//            }

        }
//        else if ("answer".equals(data.get("type"))) {
//            System.out.println("Answer received: " + data.get("answer"));
//        }

    }

}
