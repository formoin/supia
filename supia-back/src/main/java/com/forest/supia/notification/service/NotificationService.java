package com.forest.supia.notification.service;


import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface NotificationService {
    SseEmitter subscribe(long memberId);

    void notifyMessage(long memberId, Object data, String comment, String eventName);

    void sendToClient(long memberId, Object data, String comment, String eventName);
}
