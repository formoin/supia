package com.forest.supia.forest.service;

import com.forest.supia.forest.dto.ForestItemResponse;
import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.entity.ForestItem;
import com.forest.supia.forest.repository.ForestItemRepository;
import com.forest.supia.forest.repository.ForestRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class ForestServiceImpl implements ForestService{

    private final ForestRepository forestRepository;
    private final ForestItemRepository forestItemRepository;
    @Override
    public ForestResponse getForest(long memberId) {
        Forest forest = forestRepository.findByMemberId(memberId);

        ForestResponse forestResponse = new ForestResponse();
        forestResponse.setForestId(forest.getId());
//        forestResponse.setMusic(forest.getMusic().getPath());
//        forestResponse.setTheme(forest.getTheme().getPath());
        List<ForestItem> forestItems = forestItemRepository.findByForestId(forest.getId());
        List<ForestItemResponse> forestItemResponseList = new ArrayList<>();

        for(ForestItem forestItem : forestItems) {
            ForestItemResponse forestItemResponse = new ForestItemResponse();

            forestItemResponse.setImgUrl(forestItem.getItem().getImgUrl());
            forestItemResponse.setItemId(forestItem.getItem().getId());
            forestItemResponse.setX(forestItem.getX());
            forestItemResponse.setY(forestItem.getY());
            if(forestItem.isSoundOn()) forestItemResponse.setSound(forestItem.getItem().getSpecies().getSound());

            forestItemResponseList.add(forestItemResponse);
        }

        forestResponse.setItems(forestItemResponseList);

        return forestResponse;
    }
}
