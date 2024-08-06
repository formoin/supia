package com.forest.supia.message.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
public class Message {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    private boolean fromMemberDelete;
    private boolean toMemberDelete;

    public static Message createMessage(Member fromMember, Member toMember, int category, String content) {
        Message message = new Message();
        message.category = category;
        message.content = content;
        message.fromMember = fromMember;
        message.toMember = toMember;
        message.isCheck = false;
        message.sentTime = LocalDateTime.now();
        message.fromMemberDelete = false;
        message.toMemberDelete = false;

        return message;
    }

    public Message check(Message message, long memberId) {
        if(message.getToMember().getId()==memberId){
            message.isCheck = true;
        }

        return message;
    }

    public Message delete(Message message, long memberId) {
        if(message.toMember.getId() == memberId) {
            message.toMemberDelete = true;
        }
        else {
            message.fromMemberDelete = true;
        }

        return message;
    }
}
