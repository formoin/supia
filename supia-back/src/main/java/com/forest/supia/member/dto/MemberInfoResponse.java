package com.forest.supia.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberInfoResponse {
    private Long id;
    private String email;
    private String name;
    private String nickname;
    private String profileImg;
    private String thumbnail;
    private int level;
    private int exp;
    private int point;
    private int visit;
    private boolean isActive;
    private long unreadMessage;
    private long isCheckAlarm;
}
