package com.forest.supia.friend.service;

import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.friend.dto.FriendResponse;

import java.util.List;

public interface FriendService {
    List<FriendResponse> getFriendsList(long memberId);

    long sendFriendRequest(FriendRequest friendRequest);

    long acceptFriendRequest(long friendId);

    long deleteFriend(long friendId);
}
