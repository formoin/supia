package com.forest.supia.item.service;

import com.forest.supia.item.dto.SpeciesDetailResponse;
import com.forest.supia.item.dto.SpeciesResponse;

import java.util.List;

public interface ItemService {
    List<SpeciesResponse> getDictionary(long memberId, String category);

    SpeciesDetailResponse getDetailSpecies(long memberId, long speciesId);

    void deleteItem(long itemId) throws Exception;
}
