package com.forest.supia.item.controller;

import com.forest.supia.item.dto.ItemResponse;
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

    @GetMapping
    public ResponseEntity<?> getDictionary(@RequestParam("memberId") long memberId, @RequestParam("category") String category) throws Exception {
        List<SpeciesResponse> categoryResponseList = itemService.getDictionary(memberId, category);
        return ResponseEntity.ok(categoryResponseList);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getDetailSpecies(@RequestParam("memberId") long memberId, @RequestParam("speciesId") long speciesId) throws Exception {
        SpeciesDetailResponse itemDetail = itemService.getDetailSpecies(memberId, speciesId);
        if(itemDetail == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("아이템 정보 불러오기 실패");
        return ResponseEntity.ok(itemDetail);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteItem(@RequestParam("itemId") long itemId) throws Exception {

        boolean result = itemService.deleteItem(itemId);
        if(!result) return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body("아이템 삭제 실패");
        return ResponseEntity.ok(result);

    }


}
