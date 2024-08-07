package com.forest.supia.forest.repository;

import com.forest.supia.forest.entity.ForestItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ForestItemRepository extends JpaRepository<ForestItem, Long> {
    Optional<List<ForestItem>> findByForestId(long forestId);

    ForestItem findByItemId(long itemId);

    void deleteByItemId(long itemId);

}
