package com.forest.supia.background.repository;

import com.forest.supia.background.entity.OwnBgi;
import com.forest.supia.background.entity.OwnBgm;
import com.forest.supia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnBgiRepository extends JpaRepository<OwnBgi, Long> {
    List<OwnBgi> findByMember(Member member);
    Optional<OwnBgi> findByMemberAndBgiId(Member member, Long bgiId);
    void deleteByMember_Id(Long memberId);
}
