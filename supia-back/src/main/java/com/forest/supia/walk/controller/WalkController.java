package com.forest.supia.walk.controller;


import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.walk.dto.WalkDto;
import com.forest.supia.walk.service.WalkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/walk")
@RequiredArgsConstructor
public class WalkController {

    private final WalkService walkService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody WalkDto walkDto) throws Exception {

        Long id = walkService.walk(walkDto);


        if(id==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("산책 저장 실패");
        return ResponseEntity.ok(id);


    }
}
