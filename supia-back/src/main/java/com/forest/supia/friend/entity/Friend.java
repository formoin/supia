package com.forest.supia.friend.entity;

import com.forest.supia.item.entity.Item;
import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "friend")
public class Friend {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_member_id")
    private Member toMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_member_id")
    private Member fromMember;

    private boolean areWeFriend;

    public static Friend createFriend(Member fromMember, Member toMember) {
        Friend friend = new Friend();
        friend.toMember = toMember;
        friend.fromMember = fromMember;
        friend.areWeFriend = false;

        return friend;
    }

    public Friend beFriend(Friend friend) {
        friend.areWeFriend = true;

        return friend;
    }


}
