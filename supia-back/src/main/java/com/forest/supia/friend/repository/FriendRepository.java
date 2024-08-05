package com.forest.supia.friend.repository;

import com.forest.supia.friend.entity.Friend;
import com.forest.supia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByToMember(Member toMember);

    List<Friend> findByFromMember(Member fromMember);

    Friend save(Friend friend);

    void deleteById(long friendId);

}
