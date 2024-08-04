package com.forest.supia.background.service;

import com.forest.supia.background.dto.OwnResponseDto;
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

    public void purchaseBgi(Long memberId, Long bgiId) {
        Member member = memberRepository.findByMemberId(memberId);
        Bgi bgi = bgiRepository.findById(bgiId).orElseThrow(() -> new IllegalArgumentException("Invalid BGI ID"));

        OwnBgi ownBgi = new OwnBgi(member, bgi);
        ownBgiRepository.save(ownBgi);

        PurchaseHistory purchaseHistory = new PurchaseHistory(member, 2, LocalDateTime.now(), bgiId);
        purchaseHistoryRepository.save(purchaseHistory);
    }

    public List<OwnResponseDto> getOwnBgis(Long memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        List<OwnBgi> ownBgis = ownBgiRepository.findByMember(member);

        return ownBgis.stream()
                .map(ownBgi -> new OwnResponseDto(member.getMemberId(), ownBgi.getBgi().getName(), ownBgi.getBgi().getPath()))
                .collect(Collectors.toList());
    }

    public void deleteOwnBgi(Long memberId, Long bgiId) {
        Member member = memberRepository.findByMemberId(memberId);
        OwnBgi ownBgi = ownBgiRepository.findByMemberAndBgiId(member, bgiId).orElseThrow(() -> new IllegalArgumentException("유효하지 않은 접근입니다."));
        ownBgiRepository.delete(ownBgi);
    }
}
