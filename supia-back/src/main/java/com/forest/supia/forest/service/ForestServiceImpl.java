package com.forest.supia.forest.service;

import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.forest.dto.*;
import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.entity.ForestItem;
import com.forest.supia.forest.repository.ForestItemRepository;
import com.forest.supia.forest.repository.ForestRepository;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.rmi.NoSuchObjectException;
import java.security.InvalidParameterException;
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

        Forest forest = forestRepository.findByMemberId(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FOREST_EXCEPTION));


        ForestResponse forestResponse = new ForestResponse();
        forestResponse.setForestId(forest.getId());
//        forestResponse.setMusic(forest.getMusic().getPath());
//        forestResponse.setTheme(forest.getTheme().getPath());
        List<ForestItem> forestItems = forestItemRepository.findByForestId(forest.getId()).orElse(null);
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
    public long setItemForest(ForestSettingRequest forestSettingRequest) throws Exception {



        Forest forest = forestRepository.findById(forestSettingRequest.getForestId()).orElseThrow(() -> new InvalidParameterException("Cannot find forest"));


        List<ForestItemSettingRequest> forestItemSettingRequestList = forestSettingRequest.getForestItemSettingRequestList();

        for(ForestItemSettingRequest f : forestItemSettingRequestList) {

            forestItemRepository.deleteByItemId(f.getItemId());
            Item item = itemRepository.findById(f.getItemId());
            if(item == null) throw new NoSuchObjectException("해당하는 아이템이 없습니다.");
            ForestItem forestItem = ForestItem.createForestItem(item, forest, f.getX(), f.getY(), true);
            forestItemRepository.save(forestItem);

        }

        return 1;

    }

    @Override
    public ForestItem updateItemForest(ForestItemSoundRequest forestItemSoundRequest) {
        ForestItem forestItem = forestItemRepository.findById(forestItemSoundRequest.getId()).orElse(new ForestItem());

        forestItem.update(forestItemSoundRequest);


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
