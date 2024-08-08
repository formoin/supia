package com.forest.supia.walk.controller;


import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.walk.dto.WalkDto;
import com.forest.supia.walk.dto.WalkHistoryDto;
import com.forest.supia.walk.entity.Walk;
import com.forest.supia.walk.service.WalkService;
import io.jsonwebtoken.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
        return ResponseEntity.ok(id);
    }

    @GetMapping
    public ResponseEntity<?> getSpeciesByDong(@RequestParam("address") String address) throws Exception {

        List<SpeciesResponse> speciesResponseList = walkService.getSpeciesByDong(address);

        if (speciesResponseList == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해당 지역에 수집된 자연물이 없습니다.");
        return ResponseEntity.ok(speciesResponseList);
    }

    @PostMapping("/history")
    public ResponseEntity<Map<String, List<Walk>>> getWalkHistoryByMemberId(@RequestHeader("Authorization") String token) {
        Long memberId = jwtUtil.extractMemberId(token);
        List<Walk> walkHistory = walkService.getAllWalk(memberId);
        Map<String, List<Walk>> response = new HashMap<>();
        response.put("message", walkHistory);
        return ResponseEntity.ok(response);
    }
}
