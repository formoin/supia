package com.forest.supia.item.controller;

import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.item.dto.SpeciesDetailResponse;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getDictionary(@RequestHeader("Authorization") String token, @RequestParam("category") String category) throws Exception {
        long memberId = jwtUtil.extractMemberId(token);
        List<SpeciesResponse> categoryResponseList = itemService.getDictionary(memberId, category);
        return ResponseEntity.ok(categoryResponseList);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getDetailSpecies(@RequestHeader("Authorization") String token, @RequestParam("speciesId") long speciesId) throws Exception {
        long memberId = jwtUtil.extractMemberId(token);
        SpeciesDetailResponse itemDetail = itemService.getDetailSpecies(memberId, speciesId);

        return ResponseEntity.ok(itemDetail);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteItem(@RequestParam("itemId") long itemId) throws Exception {

        itemService.deleteItem(itemId);
        
        return ResponseEntity.ok("아이템 삭제 성공");

    }


}
