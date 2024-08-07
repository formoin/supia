package com.forest.supia.message.repository;

import com.forest.supia.member.entity.Member;
import com.forest.supia.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Message save(Message message);

    List<Message> findByToMemberAndCategoryAndToMemberDelete(Member member, int category, boolean toMemberDelete);
    List<Message> findByFromMemberAndCategoryAndFromMemberDelete(Member member, int category, boolean fromMemberDelete);

    List<Message> findByToMemberAndCategoryGreaterThan(Member member, int category);
}
