package com.forest.supia.friend.service;

import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.friend.dto.FriendResponse;
import com.forest.supia.member.dto.MemberResponse;

import java.util.List;

public interface FriendService {
    List<FriendResponse> getFriendsList(long memberId);

    MemberResponse getFriendProfile(long memberId, long friendId);

    void sendFriendRequest(FriendRequest friendRequest);

    void acceptFriendRequest(long messageId);

    void refuseFriendRequest(long messageId);

    void deleteFriend(long friendId);
}
