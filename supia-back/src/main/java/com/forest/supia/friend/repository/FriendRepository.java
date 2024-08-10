package com.forest.supia.friend.repository;

import com.forest.supia.friend.entity.Friend;
import com.forest.supia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    Optional<List<Friend>> findByToMember(Member toMember);

    Optional<List<Friend>> findByFromMember(Member fromMember);

    Friend save(Friend friend);

    void deleteById(long friendId);

    Optional<Friend> findByFromMemberAndToMember(Member fromMember, Member toMember);

    void deleteByFromMemberAndToMember(Member fromMember, Member toMember);

    void deleteByFromMember_Id(Long memberId);

    void deleteByToMember_Id(Long memberId);
}
