package com.forest.supia.member.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpDto {
    private String email;
    private String name;
    private String nickname;
    private String password;
}