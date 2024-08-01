package com.forest.supia.item.controller;

import com.forest.supia.walk.dto.WalkDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
public class ItemController {

    @GetMapping
    public ResponseEntity<?> getDictionary(@PathVariable long userId) throws Exception {
        int id=0;
        return ResponseEntity.ok(id);

    }
}
