package com.forest.supia.walk.service;


import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.walk.dto.WalkDto;
import com.forest.supia.walk.dto.WalkHistoryResponseDto;
import com.forest.supia.walk.entity.Walk;

import java.time.Year;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

public interface WalkService {
    public Long walk(WalkDto walkDto);

    public List<SpeciesResponse> getSpeciesByDong(String address);

    List<WalkHistoryResponseDto> getMonthlyWalkHistory(Long memberId, YearMonth yearMonth);

    List<WalkHistoryResponseDto> getYearlyWalkHistory(Long memberId, Year year);

    Map<String, List<WalkHistoryResponseDto>> getCombinedWalkHistory(Long memberId);
}
