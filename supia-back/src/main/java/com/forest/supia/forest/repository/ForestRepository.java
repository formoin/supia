package com.forest.supia.forest.repository;

import com.forest.supia.forest.entity.Forest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForestRepository extends JpaRepository<Forest, Long> {
    Forest findByMemberId(long memberId);
}
