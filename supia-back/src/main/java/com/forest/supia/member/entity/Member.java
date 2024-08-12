package com.forest.supia.member.entity;

//import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.entity.ForestItem;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Builder
@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(name = "forest_id")
    private Forest forest;

    private String email;
    private String name;
    private String nickname;
    private String password;

    @Column(columnDefinition = "VARCHAR(500)")
    private String profileImg;

    private int level;
    private int exp;
    private int point;
    private int visit;
    private String token;

    @Column(name = "is_active", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean isActive = true;

    public void updateToken(String token) {
        this.token = token;
    }

    public void updateMemberInfo(String name, String nickname, String profileImg){
        this.name = name;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void setForest(Forest forest){
        this.forest = forest;
    }

    public static Member createMember(String email, String name, String nickname, String password) {
        Member member = new Member();
        member.email = email;
        member.name = name;
        member.nickname = nickname;
        member.password = password;
        member.isActive = true;
        return member;
    }


    public void addPointDistance(double distance) {

        this.point += (int) (distance / 100) * 10;
        System.out.println("Member Entity: " +this.point);
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

    public void deductPoints(int points) {
        if (this.point >= points) {
            this.point -= points;
        } else {
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
}