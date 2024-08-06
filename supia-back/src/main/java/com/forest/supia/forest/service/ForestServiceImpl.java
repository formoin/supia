package com.forest.supia.forest.service;

import com.forest.supia.forest.dto.ForestItemRequest;
import com.forest.supia.forest.dto.ForestItemResponse;
import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.entity.ForestItem;
import com.forest.supia.forest.repository.ForestItemRepository;
import com.forest.supia.forest.repository.ForestRepository;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ForestServiceImpl implements ForestService{

    private final ForestRepository forestRepository;
    private final ForestItemRepository forestItemRepository;
    private final ItemRepository itemRepository;
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

            forestItemResponse.setId(forestItem.getId());
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

    @Override
    public ForestItem setItemForest(ForestItemRequest forestItemRequest) {
        Item item = itemRepository.findById(forestItemRequest.getItemId());
        Forest forest = forestRepository.findById(forestItemRequest.getForestId()).orElseThrow();

        ForestItem forestItem = ForestItem.createForestItem(item, forest, forestItemRequest.getX(), forestItemRequest.getY(), true);

        return forestItemRepository.save(forestItem);

    }

    @Override
    public ForestItem updateItemForest(ForestItemRequest forestItemRequest) {
        ForestItem forestItem = forestItemRepository.findById(forestItemRequest.getId()).orElse(new ForestItem());

        forestItem.update(forestItemRequest);


        return forestItemRepository.save(forestItem);

    }

    @Override
    public boolean deleteItemForest(long forestItemId) {
        try {
            forestItemRepository.deleteById(forestItemId);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
}
