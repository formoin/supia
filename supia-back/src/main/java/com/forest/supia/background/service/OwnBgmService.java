package com.forest.supia.background.service;


import com.forest.supia.background.dto.OwnResponseDto;
import com.forest.supia.background.dto.PurchaseResponseDto;
import com.forest.supia.background.entity.Bgm;
import com.forest.supia.background.entity.OwnBgm;
import com.forest.supia.background.entity.PurchaseHistory;
import com.forest.supia.background.repository.BgmRepository;
import com.forest.supia.background.repository.OwnBgmRepository;
import com.forest.supia.background.repository.PurchaseHistoryRepository;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnBgmService {

    @Autowired
    private OwnBgmRepository ownBgmRepository;

    @Autowired
    private BgmRepository bgmRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    public PurchaseResponseDto purchaseBgm (Long memberId, Long bgmId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        Bgm bgm = bgmRepository.findById(bgmId).orElseThrow(() -> new IllegalArgumentException("유효하지 않은 BGMㅇㅂ니다."));

        if (member.getPoint() >= bgm.getPrice()) {
            member.deductPoints(bgm.getPrice());
            memberRepository.save(member);
            OwnBgm ownBgm = new OwnBgm(member, bgm);
            ownBgmRepository.save(ownBgm);
            PurchaseHistory purchaseHistory = new PurchaseHistory(member, 1, LocalDateTime.now(), bgmId);
            purchaseHistoryRepository.save(purchaseHistory);
            return new PurchaseResponseDto(memberId, bgmId, bgm.getPrice(), member.getPoint(), "bgm");
        } else {
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }


    }

    public List<OwnResponseDto> getOwnBgms(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        List<OwnBgm> ownBgms = ownBgmRepository.findByMember(member);

        return ownBgms.stream()
                .map(ownBgm -> new OwnResponseDto(ownBgm.getBgm().getId(), member.getId(), ownBgm.getBgm().getName(), ownBgm.getBgm().getPath()))
                .collect(Collectors.toList());

    }

    public void deleteOwnBgm(Long memberId, Long bgmId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        OwnBgm ownBgm = ownBgmRepository.findByMemberAndBgmId(member, bgmId).orElseThrow(() -> new IllegalArgumentException("유효하지 않은 접근입니다."));
        ownBgmRepository.delete(ownBgm);
    }


}
