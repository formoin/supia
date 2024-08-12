package com.forest.supia.forest.service;

import com.forest.supia.background.entity.Bgi;
import com.forest.supia.background.entity.Bgm;
import com.forest.supia.background.repository.BgiRepository;
import com.forest.supia.background.repository.BgmRepository;
import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.forest.dto.*;
import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.entity.ForestItem;
import com.forest.supia.forest.repository.ForestItemRepository;
import com.forest.supia.forest.repository.ForestRepository;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.member.repository.MemberRepository;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
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
    private final MemberRepository memberRepository;
    private final BgiRepository bgiRepository;
    private final BgmRepository bgmRepository;

    @Override
    public ForestResponse getForest(long memberId) {

        Forest forest = forestRepository.findByMemberId(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_FOREST_EXCEPTION));


        ForestResponse forestResponse = new ForestResponse();
        forestResponse.setForestId(forest.getId());
        forestResponse.setBgm(forest.getBgm());
        forestResponse.setBgi(forest.getBgi());
        List<ForestItem> forestItems = forestItemRepository.findByForestId(forest.getId()).orElse(new ArrayList<>());
        List<ForestItemResponse> forestItemResponseList = new ArrayList<>();

        for(ForestItem forestItem : forestItems) {
            ForestItemResponse forestItemResponse = new ForestItemResponse();

            forestItemResponse.setId(forestItem.getId());
            forestItemResponse.setImgUrl(forestItem.getItem().getImgUrl());
            forestItemResponse.setItemId(forestItem.getItem().getId());
            forestItemResponse.setX(forestItem.getX());
            forestItemResponse.setY(forestItem.getY());
            forestItemResponse.setSoundOn(forestItem.isSoundOn());
            forestItemResponse.setSoundUrl(forestItem.getItem().getSpecies().getSound());

            forestItemResponseList.add(forestItemResponse);
        }

        forestResponse.setItems(forestItemResponseList);

        return forestResponse;
    }


    @Override
    @Transactional
    public void setItemForest(ForestSettingRequest forestSettingRequest) throws Exception {
        Forest forest = forestRepository.findById(forestSettingRequest.getForestId()).orElseThrow(() -> new InvalidParameterException("Cannot find forest"));

        // 숲 썸네일, 테마 설정
        forest.setThumbnail(forestSettingRequest.getThumbnail());
        forest.setTheme(forestSettingRequest.getBgm(), forestSettingRequest.getBgi());
        forestRepository.save(forest);
        
        if(forest.getThumbnail()== null) throw new ExceptionResponse(CustomException.FAIL_SAVE_FOREST_EXCEPTION);
        
        // 현재 있는 아이템 삭제
        List<ForestItem> forestItems = forestItemRepository.findByForestId(forest.getId()).orElse(new ArrayList<>());
        List<Long> forestItemIds = new ArrayList<>();
        for(ForestItem forestItem:forestItems) {
            forestItemIds.add(forestItem.getId());
        }
        forestItemRepository.deleteAllByIds(forestItemIds);
        
        // 숲에 아이템 배치
        List<ForestItemSettingRequest> forestItemSettingRequestList = forestSettingRequest.getForestItemSettingRequestList();
        for(ForestItemSettingRequest f : forestItemSettingRequestList) {
            Item item = itemRepository.findById(f.getItemId()).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_ITEM_EXCEPTION));

            ForestItem forestItem = ForestItem.createForestItem(item, forest, f.getX(), f.getY(), true);
            forestItemRepository.save(forestItem);
        }


    }

    @Override
    public void updateSoundForest(ForestItemSoundRequest forestItemSoundRequest) {
        ForestItem forestItem = forestItemRepository.findByItemId(forestItemSoundRequest.getItemId()).orElse(new ForestItem());

        forestItem.update(forestItemSoundRequest);

        try{
            forestItemRepository.save(forestItem);
        }
        catch (PersistenceException e) {
            throw new ExceptionResponse(CustomException.FAIL_SAVE_FOREST_EXCEPTION);
        }

    }

    @Override
    public void deleteItemForest(long forestItemId) {
        try {
            forestItemRepository.deleteById(forestItemId);
        }
        catch (Exception e) {
            throw new ExceptionResponse(CustomException.FAIL_DELETE_ITEM_EXCEPTION);
        }
    }

    @Override
    public void updateForestTheme(long memberId, long itemId, int type) {
        Forest forest = memberRepository.findById(memberId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_FOREST_EXCEPTION)).getForest();

        Bgm bgm;
        Bgi bgi;

        if(type ==0) {
            bgm = bgmRepository.findById(itemId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_BACKGROUND_ITEM_EXCEPTION));
            forest.setTheme( bgm.getPath(), forest.getBgi() );
        }
        else if(type ==1) {
            bgi = bgiRepository.findById(itemId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_BACKGROUND_ITEM_EXCEPTION));
            forest.setTheme(forest.getBgm(), bgi.getPath());
        }

        try {
            forestRepository.save(forest);
        }
        catch (PersistenceException e) {
            throw new ExceptionResponse(CustomException.FAIL_SAVE_FOREST_EXCEPTION);
        }

    }


}
