package com.forest.supia.search.service;

import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Species;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.item.repository.SpeciesRepository;
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
    private final SpeciesRepository speciesRepository;

    @Override
    public List<ItemSearchResponse> searchItem(String keyword) {


        List<ItemSearchResponse> itemSearchResponses = itemRepository.findItemByKeyword(keyword);

//        for(Item item : items) {
//            ItemSearchResponse itemSearchResponse = new ItemSearchResponse();
//            itemSearchResponse.setItemId(item.getId());
//            itemSearchResponse.setAddress(item.getSi() + " " + item.getDong());
//            itemSearchResponse.setSpeciesName(item.getSpecies().getName());
//            itemSearchResponse.setImgUrl(item.getImgUrl());
//            itemSearchResponses.add(itemSearchResponse);
//        }
        System.out.println(itemSearchResponses.get(0).getAddress());
        return itemSearchResponses;
    }

    @Override
    public List<MemberSearchResponse> searchMember(String keyword) {
        return List.of();
    }
}
