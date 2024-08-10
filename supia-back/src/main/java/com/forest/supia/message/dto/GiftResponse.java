package com.forest.supia.message.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class GiftResponse {
    private long messageId;
    private String fromMemberNickname;
    private String fromMemberImg;
    private String species;
    private String content;
    private LocalDateTime sentTime;
}
