package com.forest.supia.member.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MemberResponse {

    private long memberId;
    private String nickname;
    private String name;
    private int level;
    private String profileImg;
    private String thumbnail;
    private boolean isFriend;

}
