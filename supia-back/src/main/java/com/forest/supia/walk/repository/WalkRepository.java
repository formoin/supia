package com.forest.supia.walk.repository;

import com.forest.supia.member.model.Member;
import com.forest.supia.walk.entity.Walk;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkRepository extends JpaRepository<Member, Long>  {

    Walk save(Walk walk);


}
