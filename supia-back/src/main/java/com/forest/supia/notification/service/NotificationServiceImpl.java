package com.forest.supia.notification.service;

import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.notification.controller.NotificationController;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final MemberRepository memberRepository;


    @Override
    public SseEmitter subscribe(long memberId) {

        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);

        try {
            sseEmitter.send(SseEmitter.event().name("connect"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        NotificationController.sseEmitterMap.put(memberId, sseEmitter);

        sseEmitter.onCompletion(()-> NotificationController.sseEmitterMap.remove(memberId));
        sseEmitter.onTimeout(() -> NotificationController.sseEmitterMap.remove(memberId));
        sseEmitter.onError((e) -> NotificationController.sseEmitterMap.remove(memberId));


        return sseEmitter;
    }

    @Override
    public void notifyMessage(long memberId) {

        if(NotificationController.sseEmitterMap.containsKey(memberId)) {
            SseEmitter sseEmitterReceiver = NotificationController.sseEmitterMap.get(memberId);

            try {
                sseEmitterReceiver.send(SseEmitter.event().name("addMessage").data("메세지가 왔습니다."));
            }
            catch (Exception e) {
                NotificationController.sseEmitterMap.remove(memberId);
            }
        }
    }
}
