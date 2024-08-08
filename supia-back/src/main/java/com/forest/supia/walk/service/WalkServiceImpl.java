package com.forest.supia.walk.service;

import com.forest.supia.item.dto.ItemDto;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Species;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.item.repository.SpeciesRepository;
import com.forest.supia.member.entity.Member;
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
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public Long walk(WalkDto walkDto) {

        Member member = memberRepository.findById(walkDto.getMemberId()).orElseThrow();

        LocalDateTime startDateTime = walkDto.getWalkStart();
        LocalDateTime endDateTime = walkDto.getWalkEnd();

        Duration duration = Duration.between(startDateTime, endDateTime);

        long walkTime =  duration.toSeconds();
        LocalDate walkDate = LocalDate.from(endDateTime);

        List<Item> items = new ArrayList<>();

        for(ItemDto itemDto : walkDto.getItems()) {
            String address = itemDto.getPosition();

            //TODO: 주소 요청 데이터 형태 확인 및 시, 동 string 변환
            String[] addressSplit = address.split(" ");
            //TODO: 찾는 종 데이터 없을 시, 예외 처리. 이름 저장하게 하기
            Species species = speciesRepository.findByNameContaining(itemDto.getSpecies()).orElse(null);
            if(species==null) {
                species = Species.createSpecies(itemDto.getSpecies(), itemDto.getImageUrl());
                speciesRepository.save(species);
                System.out.println(species.getId());
            }
            Item item = Item.createItem(member, species, walkDate, addressSplit[0], addressSplit[2], itemDto.getImageUrl(), itemDto.getOriginalUrl());
            items.add(item);
        }

        Walk walk = Walk.createWalk(member, walkDate, walkTime, walkDto.getDistance(), items);

        walkRepository.save(walk);
        return walk.getId();
    }

    @Override
    public List<SpeciesResponse> getSpeciesByDong(String address) {
        //TODO: 주소에서 시, 동 변환 하는 로직

        String[] addressSplit = address.split(" ");

        String si = addressSplit[0];
        String dong = addressSplit[2];

        return itemRepository.speciesResponseListByDong(si, dong);
    }

    @Override
    public List<Walk> getAllWalk(Long memberId) {
        return walkRepository.findAllByMember_Id(memberId);
    }

}
