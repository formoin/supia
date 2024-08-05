package com.forest.supia.message.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
public class Message {

    @Id @GeneratedValue
    private long id;

    private String content;
    private int category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_member_id")
    private Member fromMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_member_id")
    private Member toMember;
    private boolean isCheck;
    private LocalDateTime sentTime;

    public static Message createMessage(Member fromMember, Member toMember, int category, String content) {
        Message message = new Message();
        message.category = category;
        message.content = content;
        message.fromMember = fromMember;
        message.toMember = toMember;
        message.isCheck = false;
        message.sentTime = LocalDateTime.now();

        return message;
    }

    public Message check(Message message) {
        message.isCheck = true;

        return message;
    }
}
