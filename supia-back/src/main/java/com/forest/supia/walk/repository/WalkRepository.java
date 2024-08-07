package com.forest.supia.walk.repository;

import com.forest.supia.member.entity.Member;
import com.forest.supia.walk.entity.Walk;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkRepository extends JpaRepository<Walk, Long>  {

    Walk save(Walk walk);

    void deleteByMember_Id(Long memberId);

}
