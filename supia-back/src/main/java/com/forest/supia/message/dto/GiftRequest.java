package com.forest.supia.message.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class GiftRequest {
    private long toMemberId;
    private long fromMemberId;
    private long itemId;

}
