package com.forest.supia.notification.repository;

import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
@RequiredArgsConstructor
@ToString
public class EmitterRepository {
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void save(long memberId, SseEmitter emitter) {
        emitters.put(memberId, emitter);
    }
    public void deleteById(long memberId) {
        emitters.remove(memberId);
    }
    public SseEmitter get(long memberId) {
        return emitters.get(memberId);
    }
    public int size() {
        return emitters.size();
    }

}
