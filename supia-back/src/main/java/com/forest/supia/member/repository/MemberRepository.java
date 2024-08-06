package com.forest.supia.member.repository;

import com.forest.supia.member.entity.Member;
import com.forest.supia.search.dto.ItemSearchResponse;
import com.forest.supia.search.dto.MemberSearchResponse;
import org.springframework.data.jpa.repository.JpaRepository;
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
                    "WHERE m.name LIKE concat('%', :keyword, '%') OR m.nickname LIKE concat('%', :keyword, '%') OR m.email LIKE concat('%', :keyword, '%') ",
            nativeQuery = true
    )
    List<MemberSearchResponse> findMemberByKeyword(@Param("keyword") String keyword);

}
