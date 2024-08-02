package com.forest.supia.friends.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FriendResponse {
    private long friendId;
    private String name;
    private String nickname;
    private String profileImg;
    private long forestId;
}

