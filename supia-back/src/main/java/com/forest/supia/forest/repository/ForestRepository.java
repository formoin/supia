package com.forest.supia.forest.repository;

import com.forest.supia.forest.entity.Forest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForestRepository extends JpaRepository<Forest, Long> {

    Optional<Forest> findByMemberId(long memberId);
    Forest findByMember_Id(Long memberId);


}
