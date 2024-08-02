package com.forest.supia.friends.repository;

import com.forest.supia.friends.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByToMemberId(long toMemberId);

    List<Friend> findByFromMemberId(long fromMemberId);
}
