package com.forest.supia.member.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long memberId;
    private String email;
    private String name;
    private String nickname;
    private String password;
    private String profileImg;
    private int level;
    private int exp;
    private int point;
    private int visit;
}