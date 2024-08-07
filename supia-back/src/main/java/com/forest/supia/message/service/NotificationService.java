package com.forest.supia.message.service;


import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface NotificationService {
    SseEmitter subscribe(long memberId);

    void notifyMessage(String receiver);
}
