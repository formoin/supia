package com.forest.supia.member.repository;

import com.forest.supia.member.entity.Member;
import com.forest.supia.search.dto.ItemSearchResponse;
import com.forest.supia.search.dto.MemberSearchResponse;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByEmail(String email);

    Optional<Member> findById(Long id);


    @Query(
            value = "SELECT " +
                    "m.id AS memberId, m.nickname AS nickname, m.name AS name, m.profile_img AS imgUrl " +
                    "FROM member m " +
                    "WHERE (m.name LIKE concat('%', :keyword, '%') OR m.nickname LIKE concat('%', :keyword, '%')) " +
                    "AND is_active = 1 ",
            nativeQuery = true
    )
    List<MemberSearchResponse> findMemberByKeyword(@Param("keyword") String keyword);

    Optional<Member> findByIdAndIsActiveTrue(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Member m SET m.visit = 0")
    void resetVisitCount();

}
