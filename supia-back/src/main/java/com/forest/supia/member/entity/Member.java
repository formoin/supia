package com.forest.supia.member.entity;

//import com.forest.supia.forest.entity.Forest;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

//    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JoinColumn(name = "fo")
//    private Forest forest;
    private String email;
    private String name;
    private String nickname;
    private String password;
    private String profileImg;
    private int level;
    private int exp;
    private int point;
    private int visit;
    private String token;

    public void updateToken(String token) {
        this.token = token;
    }

    public void updateMemberInfo(String name, String nickname, String profileImg){
        this.name = name;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }


    public static Member createMember(String email, String name, String nickname, String password) {
        Member member = new Member();
        member.email = email;
        member.name = name;
        member.nickname = nickname;
        member.password = password;

        return member;
    }

    public void addPointDistance(double distance) {

        this.point += (int) (distance / 100) * 10;
    }

    public void addPointItem(int cnt) {
        this.exp += cnt*10;
        this.point += cnt*100;
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