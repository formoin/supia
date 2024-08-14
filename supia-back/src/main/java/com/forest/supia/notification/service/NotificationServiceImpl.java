package com.forest.supia.notification.service;

import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
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

        System.out.println("subscribe: " + memberId);
        System.out.println(emitterRepository.size());
        System.out.println(emitterRepository.get(memberId));
        System.out.println("======================");

        sseEmitter.onCompletion(()-> {
            emitterRepository.deleteById(memberId);
            System.out.println("complete: " + memberId);
        });
        sseEmitter.onTimeout(() -> {
            emitterRepository.deleteById(memberId);
            System.out.println("timeout: " + memberId);
        });
        sseEmitter.onError((e) -> {
            emitterRepository.deleteById(memberId);
            System.out.println("error: " + memberId);
        });


        try {
            sseEmitter.send(SseEmitter.event()
                    .id(String.valueOf(memberId))
                    .name("test")
                    .data("test")
                    .comment("test"));
        } catch (IOException e) {
            emitterRepository.deleteById(memberId);
            sseEmitter.completeWithError(e);
            throw new ExceptionResponse(CustomException.FAIL_SEND_NOTIFICATION_EXCEPTION);
        }


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
                throw new ExceptionResponse(CustomException.FAIL_SEND_NOTIFICATION_EXCEPTION);
            }
        }
    }

}
