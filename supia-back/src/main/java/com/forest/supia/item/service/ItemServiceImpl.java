package com.forest.supia.item.service;

import com.forest.supia.item.dto.ItemDetailResponse;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Species;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.item.repository.SpeciesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {


    private final ItemRepository itemRepository;
    private final SpeciesRepository speciesRepository;

    @Override
    public List<SpeciesResponse> getDictionary(long memberId, String category) {

        return itemRepository.speciesResponseListJPQL(memberId, category);
    }

    @Override
    public ItemDetailResponse getItemInfo(long speciesId) {

//        ItemDetailResponse itemDetailResponse = new ItemDetailResponse();
//        Species species = speciesRepository.findById(speciesId).orElseThrow();
////        Item item =  itemRepository.findById(itemId);
//
//        itemDetailResponse.setSpeciesName(species.getName());
//        itemDetailResponse.setDescription(species.getDescription());
//        itemDetailResponse.setImg(item.getImgUrl());
//        itemDetailResponse.setAcquireDate(item.getAcquireDate());

        return null;
    }

}
