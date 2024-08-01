package com.forest.supia.walk.service;

import com.forest.supia.item.dto.ItemDto;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Species;
import com.forest.supia.item.repository.SpeciesRepository;
import com.forest.supia.member.model.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.walk.repository.WalkRepository;
import com.forest.supia.walk.dto.WalkDto;
import com.forest.supia.walk.entity.Walk;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalkServiceImpl implements WalkService{

    private final WalkRepository walkRepository;
    private final MemberRepository memberRepository;
    private final SpeciesRepository speciesRepository;

    @Override
    @Transactional
    public Long walk(WalkDto walkDto) {

        Member member = memberRepository.findByMemberId(walkDto.getMemberId());


        LocalDateTime startDateTime = walkDto.getWalkStart();
        LocalDateTime endDateTime = walkDto.getWalkEnd();

        Duration duration = Duration.between(startDateTime, endDateTime);

        long walkTime =  duration.toSeconds();
        LocalDate walkDate = LocalDate.from(endDateTime);

        List<Item> items = new ArrayList<>();

        for(ItemDto itemDto : walkDto.getItems()) {
            String pos = itemDto.getPosition();

            String[] buf = pos.split(" ");
            Species species = speciesRepository.findByName(itemDto.getSpecies()).orElseThrow();

            Item item = Item.createItem(member, species, walkDate, buf[0], buf[2], itemDto.getImageUrl(), itemDto.getOriginalUrl());
            items.add(item);
        }



        Walk walk = Walk.createWalk(member, walkDate, walkTime, walkDto.getDistance(), items);


        walkRepository.save(walk);
        return walk.getId();
    }

}
