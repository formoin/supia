package com.forest.supia.item.repository;



import com.forest.supia.item.dto.ItemResponse;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query(
            value = "SELECT " +
                    "s.id as id, s.name as speciesName, s.representative_img as representativeImg " +
                    "FROM item i " +
                    "INNER JOIN species s ON s.id = i.species_id " +
                    "WHERE i.member_id = :memberId AND s.category = :category " +
                    "GROUP BY s.id",
            nativeQuery = true
    )
    List<SpeciesResponse> speciesResponseList(@Param("memberId") long memberId, @Param("category") String category);

    @Query(
            value = "SELECT " +
                    "i.id, i.img_url, i.acquire_date " +
                    "FROM item i " +
                    "WHERE i.member_id = :memberId AND i.species_id = :speciesId",
            nativeQuery = true
    )
    List<ItemResponse> findByMemberIdAndSpciesId(@Param("memberId") long memberId,@Param("speciesId") long speciesId);
}
