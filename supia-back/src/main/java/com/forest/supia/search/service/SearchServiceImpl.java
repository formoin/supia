package com.forest.supia.search.service;

import com.forest.supia.friend.entity.Friend;
import com.forest.supia.friend.repository.FriendRepository;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.member.dto.MemberResponse;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.search.dto.ItemSearchResponse;
import com.forest.supia.search.dto.MemberSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService{
    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;

    @Override
    public List<ItemSearchResponse> searchItem(String keyword) {

        return itemRepository.findItemByKeyword(keyword);
    }

    @Override
    public List<MemberSearchResponse> searchMember(String keyword) {

        return memberRepository.findMemberByKeyword(keyword);
    }

    public MemberResponse memberDetail(long memberId, long findId) {
        Member findMember = memberRepository.findById(findId).orElseThrow(null);

        MemberResponse memberResponse = new MemberResponse();
        memberResponse.setMemberId(findId);
        memberResponse.setName(findMember.getName());
        memberResponse.setNickname(findMember.getNickname());
        memberResponse.setLevel(findMember.getLevel());
        memberResponse.setProfileImg(findMember.getProfileImg());
        memberResponse.setThumbnail(findMember.getForest().getThumbnail());

        boolean isFriend = false;

        List<Friend> friendListFrom = friendRepository.findByFromMember(findMember).orElse(new ArrayList<>());
        List<Friend> friendListTo = friendRepository.findByToMember(findMember).orElse(new ArrayList<>());

        for(Friend friend : friendListFrom){
            if(friend.getToMember().getId() == memberId && friend.isAreWeFriend()){
                isFriend = true;
            }
        }
        for(Friend friend : friendListTo){
            if(friend.getFromMember().getId() == memberId && friend.isAreWeFriend()){
                isFriend = true;
            }
        }

        memberResponse.setFriend(isFriend);
        return memberResponse;
    }
}
