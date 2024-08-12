package com.forest.supia.walk.service;

import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.item.dto.ItemDto;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Species;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.item.repository.SpeciesRepository;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.walk.dto.WalkHistoryResponseDto;
import com.forest.supia.walk.repository.WalkRepository;
import com.forest.supia.walk.dto.WalkDto;
import com.forest.supia.walk.entity.Walk;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WalkServiceImpl implements WalkService{

    private final WalkRepository walkRepository;
    private final MemberRepository memberRepository;
    private final SpeciesRepository speciesRepository;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public Long walk(WalkDto walkDto) {

        Member member = memberRepository.findById(walkDto.getMemberId())
                .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        LocalDateTime startDateTime = walkDto.getWalkStart();
        LocalDateTime endDateTime = walkDto.getWalkEnd();

        Duration duration = Duration.between(startDateTime, endDateTime);
        long walkTime = duration.toSeconds();
        LocalDate walkDate = LocalDate.from(endDateTime);

        List<Item> items = new ArrayList<>();

        for (ItemDto itemDto : walkDto.getItems()) {
            String address = itemDto.getPosition();

            Species species = speciesRepository.findByNameContaining(itemDto.getSpecies()).orElse(null);
            if (species == null) {
                species = Species.createSpecies(itemDto.getSpecies(), itemDto.getImageUrl());
                speciesRepository.save(species);
            }
            Item item = Item.createItem(member, species, walkDate, address, itemDto.getImageUrl(), itemDto.getOriginalUrl());
            items.add(item);

            itemRepository.save(item);
        }

        System.out.println("Walk service(before createWalk): "+member.getPoint());
        Walk walk = Walk.createWalk(member, walkDate, walkTime, walkDto.getDistance(), items);
        System.out.println("Walk service(after createWalk): "+member.getPoint());
        walkRepository.save(walk);
        return walk.getId();
    }

    @Override
    public List<SpeciesResponse> getSpeciesByDong(String dongCode) {
        return itemRepository.speciesResponseListByDong(dongCode);
    }

    @Override
    public List<WalkHistoryResponseDto> getMonthlyWalkHistory(Long memberId, YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        return walkRepository.findMonthlyWalks(memberId, startDate, endDate);
    }

    @Override
    public List<WalkHistoryResponseDto> getYearlyWalkHistory(Long memberId, Year year) {
        return walkRepository.findYearlyWalks(memberId, year.getValue());
    }

    @Override
    public Map<String, List<WalkHistoryResponseDto>> getCombinedWalkHistory(Long memberId) {
        YearMonth thisMonth = YearMonth.now();
        Year thisYear = Year.now();

        List<WalkHistoryResponseDto> monthlyHistory = getMonthlyWalkHistory(memberId, thisMonth);
        List<WalkHistoryResponseDto> yearlyHistory = getYearlyWalkHistory(memberId, thisYear);

        Map<String, List<WalkHistoryResponseDto>> combinedHistory = new HashMap<>();
        combinedHistory.put("monthly", monthlyHistory);
        combinedHistory.put("yearly", yearlyHistory);

        return combinedHistory;
    }
}
