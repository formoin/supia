package com.forest.supia.friend.service;

import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.friend.dto.FriendResponse;
import com.forest.supia.friend.entity.Friend;
import com.forest.supia.friend.repository.FriendRepository;
import com.forest.supia.member.dto.MemberResponse;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.message.entity.Message;
import com.forest.supia.message.repository.MessageRepository;
import com.forest.supia.notification.service.NotificationService;
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
    private final NotificationService notificationService;

    @Override
    public List<FriendResponse> getFriendsList(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        List<Friend> friendListFrom = friendRepository.findByFromMember(member).orElse(null);
        List<Friend> friendListTo = friendRepository.findByToMember(member).orElse(null);

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
    public MemberResponse getFriendProfile(long memberId, long friendId) {

        Friend friend = friendRepository.findById(friendId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_EXCEPTION));
        long friendMemberId = 0;
        if(friend.getToMember().getId() == memberId) friendMemberId = friend.getFromMember().getId();
        else friendMemberId = friend.getToMember().getId();

        Member member = memberRepository.findById(friendMemberId).orElse(null);
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
    public void sendFriendRequest(FriendRequest friendRequest) {
        Member fromMember = memberRepository.findById(friendRequest.getFromId()).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        Member toMember = memberRepository.findById(friendRequest.getToId()).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        Message message = Message.createMessage(fromMember, toMember, 3, fromMember.getName() + "님이 친구를 요청하셨습니다.");

        Friend friend = Friend.createFriend(fromMember, toMember);
        Friend check = friendRepository.findByFromMemberAndToMember(fromMember, toMember).orElse(null);

        int body = messageRepository.findByToMemberAndCategoryGreaterThanAndIsCheck(toMember, 1, false).orElse(new ArrayList<>()).size();

        notificationService.notifyMessage(toMember.getId(), body, "SSE", "alarm");

        if(check == null) {
            messageRepository.save(message);
            friendRepository.save(friend);
        }
        else {
            throw new ExceptionResponse(CustomException.DUPLICATED_FRIEND_REQUEST_EXCEPTION);
        }

    }

    @Override
    public void acceptFriendRequest(long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MESSAGE_EXCEPTION));
        Friend friend = friendRepository.findByFromMemberAndToMember(message.getFromMember(), message.getToMember()).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_EXCEPTION));

        friend.beFriend(friend);
        //toMember: 친구 신청 받은 사람
        //fromMember: 친구 신청 보낸 사람. 지금 친구 수락 알람 받을 사람.
        Message reply = Message.createMessage(message.getToMember(), message.getFromMember(), 4, message.getToMember().getName()+"님이 친구 요청을 수락하셨습니다.");
        messageRepository.save(reply);
        int body = messageRepository.findByToMemberAndCategoryGreaterThanAndIsCheck(message.getFromMember(), 1, false).orElse(new ArrayList<>()).size();
        notificationService.notifyMessage(message.getFromMember().getId(), body, "SSE", "alarm");

        friendRepository.save(friend);
        messageRepository.deleteById(messageId);

    }

    @Override
    public void refuseFriendRequest(long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MESSAGE_EXCEPTION));
        Friend friend = friendRepository.findByFromMemberAndToMember(message.getFromMember(), message.getToMember()).orElseThrow(()-> new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_EXCEPTION));



        friendRepository.deleteById(friend.getId());
        messageRepository.deleteById(messageId);

    }

    @Override
    public void deleteFriend(long friendId) {

        if(!friendRepository.existsById(friendId)) {
            throw new ExceptionResponse(CustomException.NOT_FOUND_FRIEND_EXCEPTION);
        }

        friendRepository.deleteById(friendId);


    }
}
