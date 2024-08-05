package com.forest.supia.message.repository;

import com.forest.supia.member.entity.Member;
import com.forest.supia.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Message save(Message message);

    List<Message> findByToMember(Member member);
}
