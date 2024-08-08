package com.forest.supia.notification.service;

import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.notification.controller.NotificationController;
import com.forest.supia.notification.dto.ConnectedResponseDto;
import com.forest.supia.notification.repository.EmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final EmitterRepository emitterRepository;

    @Override
    public SseEmitter subscribe(long memberId) {

        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        emitterRepository.save(memberId, sseEmitter);


        sseEmitter.onCompletion(()-> emitterRepository.deleteById(memberId));
        sseEmitter.onTimeout(() -> emitterRepository.deleteById(memberId));
        sseEmitter.onError((e) -> emitterRepository.deleteById(memberId));


        return sseEmitter;

    }

    @Override
    public void notifyMessage(long memberId, Object data, String comment, String eventName) {

        sendToClient(memberId, data, comment, eventName);
    }
    @Override
    public void sendToClient(long memberId, Object data, String comment, String eventName) {
        SseEmitter emitter = emitterRepository.get(memberId);
        if (emitter != null) {
            try {

                emitter.send(SseEmitter.event()
                        .id(String.valueOf(memberId))
                        .name(eventName)
                        .data(data)
                        .comment(comment));
            } catch (IOException e) {
                emitterRepository.deleteById(memberId);
                emitter.completeWithError(e);
            }
        }
    }

}
