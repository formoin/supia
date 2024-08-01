package com.forest.supia.member.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
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

    public void updateMemberInfo(String name, String nickname, String profileImg){
        this.name = name;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }

    public void addPointDistance(double distance) {

        this.point += (int) (distance / 100) * 10;
    }

    public void addPointItem(int cnt) {

        this.point += cnt * 100;
    }

    public void addExpVisit() {
        this.visit = 1;
        this.exp += 5;
    }

    public void addExpSendGift() {
        this.exp += 5;
    }

    public void addExpItem(int cnt) {
        this.exp += cnt * 10;
    }

}