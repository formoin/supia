package com.forest.supia.forest.repository;

import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.entity.ForestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ForestItemRepository extends JpaRepository<ForestItem, Long> {

    Optional<List<ForestItem>> findByForestId(long forestId);


    ForestItem findByItemId(Long itemId);

    void deleteByItemId(Long itemId);

    void deleteByForest_Id(Long forestId);

    void deleteByForest(Forest forest);

    @Modifying
    @Query("delete from ForestItem i where i.id in :ids")
    void deleteAllByIds(@Param("ids") List<Long> ids);
}
