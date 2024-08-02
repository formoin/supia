package com.forest.supia.forest.controller;

import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.service.ForestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/forest")
@RequiredArgsConstructor
public class ForestController {
    private final ForestService forestService;

    @GetMapping
    public ResponseEntity<?> getForest(@RequestParam("memberId") long memberId) throws Exception {
        ForestResponse forest = forestService.getForest(memberId);

        return ResponseEntity.ok(forest);
    }

    

}
