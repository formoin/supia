package com.forest.supia.walk.entity;

//import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Item;
import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Table(name = "Walk")
public class Walk {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDate walkDate;
    private long walkTime;
    private double distance;


    //==연관관계 메서드==//

//    public void addItem(Item item) {
//        item.setWalk(this);
//    }

    //==생성 메서드==//
    public static Walk createWalk(Member member, LocalDate walkDate, long walkTime, double distance, List<Item> items) {


        Walk walk = new Walk();

        walk.member = member;
        walk.walkDate = walkDate;
        walk.walkTime = walkTime;
        walk.distance = distance;

//        for(Item item : items) {
//            walk.addItem(item);
//        }

        // member 포인트 설정
        member.addPointDistance(distance);
        System.out.println("Walk entity!!!! : " + member.getPoint());
        member.addPointItem(items.size());
        return walk;

    }

}
