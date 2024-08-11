package com.forest.supia.friend.controller;

import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.exception.HttpResponseUtil;
import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.friend.dto.FriendResponse;
import com.forest.supia.friend.service.FriendService;
import com.forest.supia.member.dto.MemberResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.InvalidParameterException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friends")
public class FriendController {

    private final FriendService friendService;
    private final JwtUtil jwtUtil;
    private final HttpResponseUtil httpResponseUtil;

    @GetMapping
    public ResponseEntity<?> getFriendsList(@RequestHeader("Authorization") String token) throws Exception {
        long memberId = jwtUtil.extractMemberId(token);
        List<FriendResponse> getFriendsList = friendService.getFriendsList(memberId);

        return ResponseEntity.ok(getFriendsList);
    }

    @PostMapping
    public ResponseEntity<?> sendFriendRequest(@RequestBody FriendRequest friendRequest) {
        friendService.sendFriendRequest(friendRequest);
        return ResponseEntity.ok("친구 요청 성공");

    }

    @DeleteMapping
    public ResponseEntity<?> deleteFriend(@RequestParam("friendId") long friendId) {
        friendService.deleteFriend(friendId);

        return ResponseEntity.ok("친구 삭제 성공");
    }

    @GetMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam("messageId") long messageId) {
        friendService.acceptFriendRequest(messageId);

        return ResponseEntity.ok("친구 수락 성공");
    }

    @DeleteMapping("/refuse")
    public ResponseEntity<?> refuseFriendRequest(@RequestParam("messageId") long messageId) {
        friendService.refuseFriendRequest(messageId);

        return ResponseEntity.ok("친구 거절 성공");
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getFriendProfile (@RequestHeader("Authorization") String token, @RequestParam("friendId") long friendId) {
        long memberId = jwtUtil.extractMemberId(token);
        MemberResponse result = friendService.getFriendProfile(memberId, friendId);

        
        return ResponseEntity.ok(result);
    }
}
