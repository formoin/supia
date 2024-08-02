package com.forest.supia.friends.controller;

import com.forest.supia.friends.dto.FriendResponse;
import com.forest.supia.friends.service.FriendService;
import com.forest.supia.item.dto.SpeciesResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friends")
public class FriendController {

    private final FriendService friendService;

    @GetMapping
    public ResponseEntity<?> getFriendsList(@RequestParam("memberId") long memberId) throws Exception {
        List<FriendResponse> getFriendsList = friendService.getFriendsList(memberId);

        return ResponseEntity.ok(getFriendsList);
    }
}
