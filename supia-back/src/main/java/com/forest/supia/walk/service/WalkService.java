package com.forest.supia.walk.service;


import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.walk.dto.WalkDto;
import com.forest.supia.walk.entity.Walk;

import java.util.List;

public interface WalkService {
    public Long walk(WalkDto walkDto);

    public List<SpeciesResponse> getSpeciesByDong(String address);

    List<Walk> getAllWalk(Long memberId);
}
