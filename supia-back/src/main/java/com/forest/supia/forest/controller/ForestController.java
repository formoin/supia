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
import org.springframework.web.multipart.MultipartFile;

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


    @PostMapping("/url")
    public ResponseEntity<?> setFileToUrl(@RequestHeader("Authorization") String token, @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) throws Exception {
        long memberId = jwtUtil.extractMemberId(token);
        String s3Url = forestService.setFileToUrl(memberId, thumbnail);
        
        return ResponseEntity.ok(s3Url);
    }

    @PostMapping
    public ResponseEntity<?> setItemToForest(@RequestBody ForestSettingRequest forestSettingRequest) throws Exception {
        forestService.setItemForest(forestSettingRequest);

        return ResponseEntity.ok("숲 아이템 저장 성공");
    }

    @PatchMapping
    public ResponseEntity<?> updateSoundToForest(@RequestBody ForestItemSoundRequest forestItemSoundRequest) throws Exception {
        
        forestService.updateSoundForest(forestItemSoundRequest);

        return ResponseEntity.ok("아이템 소리 온오프 성공");
    }

    @DeleteMapping
    public ResponseEntity<?> deleteItemFromForest(@RequestParam("forestItemId") long forestItemId) throws Exception {

        forestService.deleteItemForest(forestItemId);

        return ResponseEntity.ok("아이템 삭제 성공");
    }

    

}
