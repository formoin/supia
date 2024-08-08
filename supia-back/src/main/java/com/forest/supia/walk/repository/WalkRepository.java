package com.forest.supia.walk.repository;

import com.forest.supia.member.entity.Member;
import com.forest.supia.walk.dto.WalkHistoryResponseDto;
import com.forest.supia.walk.entity.Walk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface WalkRepository extends JpaRepository<Walk, Long>  {

    Walk save(Walk walk);

    void deleteByMember_Id(Long memberId);

    @Query("SELECT new com.forest.supia.walk.dto.WalkHistoryResponseDto(w.walkDate, SUM(w.distance)) " +
            "FROM Walk w WHERE w.member.id = :memberId AND w.walkDate BETWEEN :startDate AND :endDate " +
            "GROUP BY w.walkDate")
    List<WalkHistoryResponseDto> findMonthlyWalks(@Param("memberId") Long memberId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    @Query("SELECT new com.forest.supia.walk.dto.WalkHistoryResponseDto(YEAR(w.walkDate), MONTH(w.walkDate), SUM(w.distance)) " +
            "FROM Walk w WHERE w.member.id = :memberId AND YEAR(w.walkDate) = :year " +
            "GROUP BY YEAR(w.walkDate), MONTH(w.walkDate)")
    List<WalkHistoryResponseDto> findYearlyWalks(@Param("memberId") Long memberId,
                                              @Param("year") int year);
}
