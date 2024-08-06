package com.forest.supia.search.service;

import com.forest.supia.member.dto.MemberResponse;
import com.forest.supia.search.dto.ItemSearchResponse;
import com.forest.supia.search.dto.MemberSearchResponse;

import java.util.List;

public interface SearchService {
    List<ItemSearchResponse> searchItem(String keyword);

    List<MemberSearchResponse> searchMember(String keyword);

    MemberResponse memberDetail(long memberId, long findId);
}
