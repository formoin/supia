package com.forest.supia.message.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class MessageResponse {
    private long messageId;
    private long fromMemberId;
    private String content;
    private int category;
    private LocalDateTime sentTime;
}
