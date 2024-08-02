package com.forest.supia.forest.repository;

import com.forest.supia.forest.entity.ForestItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForestItemRepository extends JpaRepository<ForestItem, Long> {
    List<ForestItem> findByForestId(long forestId);

}
