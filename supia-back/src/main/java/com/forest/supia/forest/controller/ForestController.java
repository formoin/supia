package com.forest.supia.forest.controller;

import com.forest.supia.forest.dto.ForestItemSoundRequest;

import com.forest.supia.config.auth.JwtUtil;


import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.dto.ForestSettingRequest;
import com.forest.supia.forest.entity.ForestItem;
import com.forest.supia.forest.service.ForestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/forest")
@RequiredArgsConstructor
public class ForestController {
    private final ForestService forestService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getForest(@RequestHeader("Authorization") String token) throws Exception {
        long memberId = jwtUtil.extractMemberId(token);
        ForestResponse forest = forestService.getForest(memberId);

        if(forest == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("숲 로딩에 실패했습니다.");
        return ResponseEntity.ok(forest);
    }

    @PostMapping
    public ResponseEntity<?> setItemToForest(@RequestBody ForestSettingRequest forestSettingRequest) throws Exception {


        try {
            forestService.setItemForest(forestSettingRequest);
        }
        catch (Exception e) {

            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("숲 아이템 저장에 실패했습니다.");
        }
        return ResponseEntity.ok(1);
    }

    @PatchMapping
    public ResponseEntity<?> updateItemToForest(@RequestBody ForestItemSoundRequest forestItemSoundRequest) throws Exception {


        ForestItem forestItem = forestService.updateItemForest(forestItemSoundRequest);

        if(forestItem == null) ResponseEntity.status(HttpStatus.BAD_REQUEST).body("숲 아이템 업데이트에 실패했습니다.");
        return ResponseEntity.ok(forestItem);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteItemFromForest(@RequestParam("forestItemId") long forestItemId) throws Exception {


        boolean result = forestService.deleteItemForest(forestItemId);

        if(!result) ResponseEntity.status(HttpStatus.BAD_REQUEST).body("숲 아이템 삭제에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    

}
