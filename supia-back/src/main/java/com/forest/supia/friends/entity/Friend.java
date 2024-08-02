package com.forest.supia.friends.entity;

import com.forest.supia.item.entity.Item;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "friend")
public class Friend {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_member_id")
    private Long toMemberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_member_id")
    private Long fromMemberId;

    private boolean areWeFriend;


}
