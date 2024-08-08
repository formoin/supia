package com.forest.supia.notification.controller;

import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
public class NotificationController {
    private final NotificationService notificationService;
    public static Map<Long, SseEmitter> sseEmitterMap = new ConcurrentHashMap<>();
    private final JwtUtil jwtUtill;

    @GetMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestHeader("Authorization") String token) {
        Long memberId = jwtUtill.extractMemberId(token);
        SseEmitter sseEmitter = notificationService.subscribe(memberId);

        return ResponseEntity.ok(sseEmitter);
    }

}
