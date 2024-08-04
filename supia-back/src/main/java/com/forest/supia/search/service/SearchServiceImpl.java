package com.forest.supia.search.service;

import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Species;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.item.repository.SpeciesRepository;
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

    @Override
    public List<ItemSearchResponse> searchItem(String keyword) {

        return itemRepository.findItemByKeyword(keyword);
    }

    @Override
    public List<MemberSearchResponse> searchMember(String keyword) {

        return memberRepository.findMemberByKeyword(keyword);
    }

    public MemberResponse memberDetail(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(null);

        MemberResponse memberResponse = new MemberResponse();
        memberResponse.setMemberId(memberId);
        memberResponse.setName(member.getName());
        memberResponse.setNickname(member.getNickname());
        memberResponse.setLevel(member.getLevel());
        memberResponse.setProfileImg(member.getProfileImg());
        memberResponse.setThumbnail(member.getForest().getThumbnail());

//        Boolean isFriend =
//        memberResponse.setFriend(isFriend);

        return memberResponse;
    }
}
