//package com.forest.supia.friends.entity;
//
//import com.forest.supia.item.entity.Item;
//import com.forest.supia.member.entity.Member;
//import jakarta.persistence.*;
//import lombok.Getter;
//
//@Entity
//@Getter
//@Table(name = "friend")
//public class Friend {
//    @Id @GeneratedValue
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "to_member_id")
//    private Member toMemberId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "from_member_id")
//    private Member fromMemberId;
//
//    private boolean areWeFriend;
//
//
//}
