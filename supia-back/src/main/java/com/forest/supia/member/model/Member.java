package com.forest.supia.member.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;


@Getter @Setter
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;
    private String email;
    private String name;
    private String nickname;
    private String password;
    private String profileImg;
    private int level;
    private int exp;
    private int point;
    private int visit;


    public static Member createMember(String email, String name, String nickname, String password) {
        Member member = new Member();
        member.email = email;
        member.name = name;
        member.nickname = nickname;
        member.password = password;

        return member;
    }

    public void addPointDistance(double distance) {

        this.point += (int)(distance/100) * 10;
    }

    public void addPointItem(int cnt) {
        this.exp += cnt*10;
        this.point += cnt*100;
    }

//    public void addExp



}