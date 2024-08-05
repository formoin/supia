package com.forest.supia.friend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FriendResponse {
    private long friendId;
    private long memberId;
    private String name;
    private String nickname;
    private String profileImg;
}

