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
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class WebSocketHandler extends TextWebSocketHandler {

    //clients라는 변수에 세션을 담아두기 위한 맵형식의 공간
    private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();
    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;


    //websocket handshake가 완료되어 연결이 수립될 때 호출
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        CLIENTS.put(session.getId(), session);
        System.out.println("My Session : " + session.getId());
        System.out.println("after connection established, Current Users : "+CLIENTS.keySet().toString());
    }

    //websocket 세션 연결이 종료되었을 때 호출
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        CLIENTS.remove(session.getId());
    }

    //websocket session 으로 메시지가 수신되었을 때 호출
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String id = session.getId();  //메시지를 보낸 아이디
        System.out.println("handle text Message : "+message);
        String payload = message.getPayload();
        Map<String, String> data = new ObjectMapper().readValue(payload, Map.class);
        System.out.println("Message Type : " + data.get("type"));

        if ("authenticate".equals(data.get("type"))) {
            System.out.println("authenticate check");
            String token = data.get("token");
            token = token.substring(7);

            Long memberId = jwtUtil.extractMemberId(token);
            Member member = memberRepository.findById(memberId).orElse(null);
            if (member != null && jwtUtil.validateToken(token, member)) {
                CLIENTS.put(session.getId(), session);
                session.sendMessage(new TextMessage("{\"type\": \"authenticated\"}"));

            } else {
                session.sendMessage(new TextMessage("{\"type\": \"error\", \"message\": \"Invalid token\"}"));
                session.close();
            }
        } else if ("message".equals(data.get("type"))) {
            System.out.println("Message received: " + data.get("message"));

            //메세지가 보내면 자기자신을 제외한 전체에게 broadcasting
            CLIENTS.entrySet().forEach( arg->{
                if(!arg.getKey().equals(id)) {  //같은 아이디가 아니면 메시지를 전달합니다.
                    try {
                        arg.getValue().sendMessage(message);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

    }

}
