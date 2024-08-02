package com.forest.supia.friends.service;

import com.forest.supia.friends.dto.FriendResponse;
import com.forest.supia.friends.entity.Friend;
import com.forest.supia.friends.repository.FriendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;

    @Override
    public List<FriendResponse> getFriendsList(long memberId) {
        List<Friend> friendListFrom = friendRepository.findByFromMemberId(memberId);
        List<Friend> friendListTo = friendRepository.findByFromMemberId(memberId);

        List<Long> friendIds = new ArrayList<>();
        for(Friend friend : friendListFrom) {
            if(friend.isAreWeFriend()) {
                if (friend.getFromMemberId() == memberId) friendIds.add(friend.getToMemberId());
                else friendIds.add(friend.getFromMemberId());
            }
        }

        for(Friend friend : friendListFrom) {
            if(friend.isAreWeFriend()) {
                if (friend.getFromMemberId() == memberId) friendIds.add(friend.getToMemberId());
                else friendIds.add(friend.getFromMemberId());
            }
        }




        return itemRepository.speciesResponseList(memberId, category);
    }
}
