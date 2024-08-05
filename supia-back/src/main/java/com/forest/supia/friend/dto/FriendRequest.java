package com.forest.supia.friend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class FriendRequest {
    private long fromId;
    private long toId;
}
