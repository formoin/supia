package com.forest.supia.message.repository;

import com.forest.supia.member.entity.Member;
import com.forest.supia.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Message save(Message message);


    void deleteById(long messageId);

    Optional<List<Message>> findByToMemberAndCategoryAndToMemberDelete(Member member, int category, boolean toMemberDelete);
    Optional<List<Message>> findByFromMemberAndCategoryAndFromMemberDelete(Member member, int category, boolean fromMemberDelete);

    Optional<List<Message>> findByToMemberAndCategory(Member member, int category);

    Optional<List<Message>> findByToMemberAndCategoryAndIsCheckAndToMemberDelete(Member member, int category, boolean isCheck, boolean toMemberDelete);

    Optional<List<Message>> findByToMemberAndCategoryGreaterThan(Member member, int category);
    Optional<List<Message>> findByToMemberAndCategoryGreaterThanAndIsCheck(Member member, int category, boolean isCheck);
}
