package com.forest.supia.notification.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ConnectedResponseDto {
    private String message = "SSE 정상 연결 완료!";
    private LocalDateTime timestamp;

    public ConnectedResponseDto() {
        this.timestamp = LocalDateTime.now();
    }
}
