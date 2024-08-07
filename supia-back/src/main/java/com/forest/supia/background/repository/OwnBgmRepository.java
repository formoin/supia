package com.forest.supia.background.repository;

import com.forest.supia.background.entity.OwnBgm;
import com.forest.supia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnBgmRepository extends JpaRepository<OwnBgm, Long> {
    List<OwnBgm> findByMember(Member member);
    Optional<OwnBgm> findByMemberAndBgmId(Member member, Long bgmId);
    void deleteByMember_Id(Long memberId);
}
