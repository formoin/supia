package com.forest.supia.message.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MessageRequest {
    private long toMemberId;
    private long fromMemberId;
    private String content;
}
