package com.forest.supia.friend.service;

import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.friend.dto.FriendResponse;
import com.forest.supia.friend.entity.Friend;
import com.forest.supia.friend.repository.FriendRepository;
import com.forest.supia.member.dto.MemberResponse;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.message.entity.Message;
import com.forest.supia.message.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;
    private final MemberRepository memberRepository;
    private final MessageRepository messageRepository;

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
    public MemberResponse getFriendProfile(long memberId) {

        Member member = memberRepository.findById(memberId).orElseThrow(null);
        if(member== null) return null;

        MemberResponse friendProfile = new MemberResponse();
        friendProfile.setMemberId(memberId);
        friendProfile.setName(member.getName());
        friendProfile.setNickname(member.getNickname());
        friendProfile.setLevel(member.getLevel());
        friendProfile.setProfileImg(member.getProfileImg());
        friendProfile.setThumbnail(member.getForest().getThumbnail());
        friendProfile.setFriend(true);


        return friendProfile;
    }

    @Override
    public long sendFriendRequest(FriendRequest friendRequest) {
        Member fromMember = memberRepository.findById(friendRequest.getFromId()).orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        Member toMember = memberRepository.findById(friendRequest.getToId()).orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        Message message = Message.createMessage(fromMember, toMember, 3, fromMember.getName() + "님이 친구를 요청하셨습니다.");

        Friend friend = Friend.createFriend(fromMember, toMember);
        Friend check = friendRepository.findByFromMemberAndToMember(fromMember, toMember).orElse(null);

        if(check == null) {
            messageRepository.save(message);
            Friend result = friendRepository.save(friend);
            return result.getId();
        }
        else {
            throw new InvalidParameterException("이미 보낸 친구 요청입니다.");
        }

    }

    @Override
    public long acceptFriendRequest(long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow();
        Friend friend = friendRepository.findByFromMemberAndToMember(message.getFromMember(), message.getToMember()).orElseThrow(() -> new IllegalArgumentException("해당하는 친구 요청이 없습니다."));

        friend.beFriend(friend);
        try {
            Friend result = friendRepository.save(friend);
            return result.getId();
        }
        catch (Exception e) {
            return 0;
        }
    }

    @Override
    public long refuseFriendRequest(long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new IllegalArgumentException("Invalid message ID"));
        Friend friend = friendRepository.findByFromMemberAndToMember(message.getFromMember(), message.getToMember()).orElseThrow(() -> new IllegalArgumentException("해당하는 친구 요청이 없습니다."));

        try {
            friendRepository.deleteById(friend.getId());
            messageRepository.deleteById(messageId);
            return 1;
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
