package com.forest.supia.forest.controller;

import com.forest.supia.forest.dto.ForestItemRequest;
import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.entity.ForestItem;
import com.forest.supia.forest.service.ForestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forest")
@RequiredArgsConstructor
public class ForestController {
    private final ForestService forestService;

    @GetMapping
    public ResponseEntity<?> getForest(@RequestParam("memberId") long memberId) throws Exception {
        ForestResponse forest = forestService.getForest(memberId);

        if(forest == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("숲 로딩에 실패했습니다.");
        return ResponseEntity.ok(forest);
    }

    @PostMapping
    public ResponseEntity<?> setItemToForest(@RequestBody ForestItemRequest forestItemRequest) throws Exception {


        ForestItem forestItem = forestService.setItemToForest(forestItemRequest);

        if(forestItem == null) ResponseEntity.status(HttpStatus.BAD_REQUEST).body("숲 아이템 저장에 실패했습니다.");
        return ResponseEntity.ok(forestItem);
    }

    

}
