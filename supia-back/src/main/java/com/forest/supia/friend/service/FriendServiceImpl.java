package com.forest.supia.friend.service;

import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.friend.dto.FriendResponse;
import com.forest.supia.friend.entity.Friend;
import com.forest.supia.friend.repository.FriendRepository;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<FriendResponse> getFriendsList(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(null);
        List<Friend> friendListFrom = friendRepository.findByFromMember(member);
        List<Friend> friendListTo = friendRepository.findByToMember(member);

        List<Long> friendIds = new ArrayList<>();
        List<Member> friends = new ArrayList<>();
        for(Friend friend : friendListFrom) {
            if(friend.isAreWeFriend()) {
                friends.add(friend.getToMember());
                friendIds.add(friend.getId());
            }
        }

        for(Friend friend : friendListTo) {
            if(friend.isAreWeFriend()) {
                friends.add(friend.getFromMember());
                friendIds.add(friend.getId());
            }
        }


        List<FriendResponse> friendResponseList = new ArrayList<>();

        for(int i=0; i<friends.size(); i++) {
            Member friend = friends.get(i);
            FriendResponse friendResponse = new FriendResponse();
            friendResponse.setFriendId(friendIds.get(i));
            friendResponse.setName(friend.getName());
            friendResponse.setNickname(friend.getNickname());
            friendResponse.setProfileImg(friend.getProfileImg());
            friendResponse.setMemberId(friend.getId());
//            friendResponse.setForestId(friend.getForest().getId());
            friendResponseList.add(friendResponse);
        }


        return friendResponseList;
    }

    @Override
    public long sendFriendRequest(FriendRequest friendRequest) {
        Member fromMember = memberRepository.findById(friendRequest.getFromId()).orElseThrow();
        Member toMember = memberRepository.findById(friendRequest.getToId()).orElseThrow();


        try {
            Friend friend = Friend.createFriend(fromMember, toMember);
            Friend result = friendRepository.save(friend);
            return result.getId();
        }
        catch (Exception e) {
            return 0;
        }
    }

    @Override
    public long acceptFriendRequest(long friendId) {
        Friend friend = friendRepository.findById(friendId).orElseThrow();

        friend.updateFriend(friend);
        try {
            Friend result = friendRepository.save(friend);
            return result.getId();
        }
        catch (Exception e) {
            return 0;
        }
    }

    @Override
    public long deleteFriend(long friendId) {

        try {
            friendRepository.deleteById(friendId);
            return 1;
        }
        catch (Exception e) {
            return 0;
        }

    }
}
