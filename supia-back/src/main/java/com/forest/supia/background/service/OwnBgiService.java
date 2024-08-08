package com.forest.supia.background.service;

import com.forest.supia.background.dto.OwnResponseDto;
import com.forest.supia.background.dto.PurchaseResponseDto;
import com.forest.supia.background.entity.Bgi;
import com.forest.supia.background.entity.OwnBgi;
import com.forest.supia.background.entity.PurchaseHistory;
import com.forest.supia.background.repository.BgiRepository;
import com.forest.supia.background.repository.OwnBgiRepository;
import com.forest.supia.background.repository.PurchaseHistoryRepository;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnBgiService {

    @Autowired
    private OwnBgiRepository ownBgiRepository;

    @Autowired
    private BgiRepository bgiRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    public PurchaseResponseDto purchaseBgi(Long memberId, Long bgiId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        Bgi bgi = bgiRepository.findById(bgiId).orElseThrow(() -> new IllegalArgumentException("Invalid BGI ID"));

        if (member.getPoint() >= bgi.getPrice()) {
            member.deductPoints(bgi.getPrice());
            memberRepository.save(member);
            OwnBgi ownBgi = new OwnBgi(member, bgi);
            ownBgiRepository.save(ownBgi);

            PurchaseHistory purchaseHistory = new PurchaseHistory(member, 2, LocalDateTime.now(), bgiId);
            purchaseHistoryRepository.save(purchaseHistory);
            return new PurchaseResponseDto(memberId, bgiId, bgi.getPrice(), member.getPoint(), "bgi");
        } else {
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }


    }

    public List<OwnResponseDto> getOwnBgis(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        List<OwnBgi> ownBgis = ownBgiRepository.findByMember(member);

        return ownBgis.stream()
                .map(ownBgi -> new OwnResponseDto(ownBgi.getBgi().getId(), member.getId(), ownBgi.getBgi().getName(), ownBgi.getBgi().getPath()))
                .collect(Collectors.toList());
    }

    public void deleteOwnBgi(Long memberId, Long bgiId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        OwnBgi ownBgi = ownBgiRepository.findByMemberAndBgiId(member, bgiId).orElseThrow(() -> new IllegalArgumentException("유효하지 않은 접근입니다."));
        ownBgiRepository.delete(ownBgi);
    }
}
