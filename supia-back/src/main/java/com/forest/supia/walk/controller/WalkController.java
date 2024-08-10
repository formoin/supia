package com.forest.supia.walk.controller;


import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.exception.CustomException;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.walk.dto.WalkDto;
import com.forest.supia.walk.dto.WalkHistoryResponseDto;
import com.forest.supia.walk.entity.Walk;
import com.forest.supia.walk.service.WalkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/walk")
@RequiredArgsConstructor
public class WalkController {

    private final WalkService walkService;

    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody WalkDto walkDto) throws Exception {

        Long id = walkService.walk(walkDto);

        if (id == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("산책 저장 실패");
        return ResponseEntity.ok("산책 저장 성공");
    }
    
    //동 클릭시 해당 동에 수집된 자연물 종 불러오기
    @GetMapping
    public ResponseEntity<?> getSpeciesByDong(@RequestParam("address") String address) throws Exception {

        List<SpeciesResponse> speciesResponseList = walkService.getSpeciesByDong(address);

        if (speciesResponseList == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CustomException.NOT_FOUND_RESULT_EXCEPTION);
        return ResponseEntity.ok(speciesResponseList);
    }

    @PostMapping("/history")
    public ResponseEntity<Map<String, List<WalkHistoryResponseDto>>> getWalkHistoryByMemberId(@RequestHeader("Authorization") String token) {
        Long memberId = jwtUtil.extractMemberId(token);
        Map<String, List<WalkHistoryResponseDto>> combinedHistory = walkService.getCombinedWalkHistory(memberId);
        return ResponseEntity.ok(combinedHistory);
    }
}
