package com.forest.supia.message.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{
    @Override
    public SseEmitter subscribe(long memberId) {
        return null;
    }

    @Override
    public void notifyMessage(String receiver) {

    }
}
