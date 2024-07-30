package com.forest.supia.walk.entity;

import com.forest.supia.item.entity.Item;
import com.forest.supia.member.model.Member;
import com.forest.supia.walk.dto.WalkDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDate;
import java.util.List;


@Entity
@Getter @Setter
@Table(name = "Walk")
public class Walk {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDate walkDate;
    private long walkTime;
    private long distance;

    @OneToMany
    private List<Item> items;
    //==연관관계 메서드==//


    //==생성 메서드==//
    public static Walk createWalk(Member member, LocalDate walkDate, long walkTime, long distance) {

        Walk walk = new Walk();
        walk.setMember(member);
        walk.setWalkTime(walkTime);
        walk.setWalkDate(walkDate);
        walk.setDistance(distance);

        // member 포인트 설정
        // member.addPoint(distance);
        return walk;

    }
}
