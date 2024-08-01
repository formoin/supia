package com.forest.supia.item.service;

import com.forest.supia.item.dto.ItemDetailResponse;
import com.forest.supia.item.dto.SpeciesResponse;

import java.util.List;

public interface ItemService {
    List<SpeciesResponse> getDictionary(long memberId, String category);

    ItemDetailResponse getItemInfo(long itemId);

}
