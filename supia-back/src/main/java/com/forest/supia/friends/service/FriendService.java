package com.forest.supia.friends.service;

import com.forest.supia.friends.dto.FriendResponse;

import java.util.List;

public interface FriendService {
    List<FriendResponse> getFriendsList(long memberId);
}
