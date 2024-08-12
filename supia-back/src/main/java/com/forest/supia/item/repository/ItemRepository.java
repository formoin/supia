package com.forest.supia.item.repository;



import com.forest.supia.item.dto.ItemResponse;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.entity.Species;
import com.forest.supia.member.entity.Member;
import com.forest.supia.search.dto.ItemSearchResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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

    @Query(
            value = "SELECT " +
                    "s.id as id, s.name as speciesName, s.representative_img as representativeImg " +
                    "FROM item i " +
                    "INNER JOIN species s ON s.id = i.species_id " +
                    "WHERE i.dong_code = :dongCode " +
                    "GROUP BY s.id",
            nativeQuery = true
    )
    List<SpeciesResponse> speciesResponseListByDong(@Param("dongCode") String dongCode);

    Optional<Item> findById(long itemId);
    void deleteById(long itemId);

    @Query(
            value = "SELECT " +
                    "i.id AS itemId, s.name AS speciesName, i.dong_code AS address, i.img_url AS imgUrl " +
                    "FROM item i " +
                    "INNER JOIN species s ON i.species_id = s.id " +
                    "WHERE s.name LIKE concat('%', :keyword, '%') OR i.dong_code LIKE concat('%', :keyword, '%')",
            nativeQuery = true
    )
    List<ItemSearchResponse> findItemByKeyword(@Param("keyword") String keyword);

    List<Item> findAllByMember(Member member);

    Item findByImgUrl(String url);

    @Modifying
    @Query("UPDATE Item i SET i.member = NULL WHERE i.member.id = :memberId")
    void updateMemberIdToNull(Long memberId);

}
