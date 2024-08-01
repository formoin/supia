package com.forest.supia.item.service;

import com.forest.supia.item.dto.ItemResponse;
import com.forest.supia.item.dto.SpeciesDetailResponse;
import com.forest.supia.item.dto.SpeciesResponse;
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
            itemRepository.deleteById(itemId);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

}
