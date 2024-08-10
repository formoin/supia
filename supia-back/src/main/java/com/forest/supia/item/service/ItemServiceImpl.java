package com.forest.supia.item.service;

import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.forest.entity.ForestItem;
import com.forest.supia.forest.repository.ForestItemRepository;
import com.forest.supia.item.dto.ItemResponse;
import com.forest.supia.item.dto.SpeciesDetailResponse;
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
    private final ForestItemRepository forestItemRepository;

    @Override
    public List<SpeciesResponse> getDictionary(long memberId, String category) {

        return itemRepository.speciesResponseList(memberId, category);
    }

    @Override
    public SpeciesDetailResponse getDetailSpecies(long memberId, long speciesId) {

        SpeciesDetailResponse speciesDetailResponse = new SpeciesDetailResponse();

        Species species = speciesRepository.findById(speciesId).orElseThrow();

        speciesDetailResponse.setSpeciesName(species.getName());
        speciesDetailResponse.setDescription(species.getDescription());

        List<ItemResponse> itemResponseList =  itemRepository.findByMemberIdAndSpciesId(memberId, speciesId);

        speciesDetailResponse.setItems(itemResponseList);

        return speciesDetailResponse;
    }

    @Override
    public boolean deleteItem(long itemId) {
        try {
            System.out.println("!!!!!!!!"+itemId);
            Item item = itemRepository.findById(itemId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_ITEM_EXCEPTION));
            forestItemRepository.findByItemId(itemId).ifPresent(forestItem -> forestItemRepository.deleteById(forestItem.getId()));

            item.setMember(null);
            itemRepository.save(item);
            return true;
        }
        catch (Exception e) {
            throw new ExceptionResponse(CustomException.FAIL_DELETE_ITEM_EXCEPTION);
        }
    }

}
