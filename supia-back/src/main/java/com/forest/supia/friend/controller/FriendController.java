package com.forest.supia.friend.controller;

import com.forest.supia.config.auth.JwtUtil;
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

    @GetMapping
    public ResponseEntity<?> getFriendsList(@RequestHeader("Authorization") String token) throws Exception {
        long memberId = jwtUtil.extractMemberId(token);

        List<FriendResponse> getFriendsList = friendService.getFriendsList(memberId);
        if(getFriendsList.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록된 친구가 없습니다.");
        return ResponseEntity.ok(getFriendsList);
    }

    @PostMapping
    public ResponseEntity<?> sendFriendRequest(@RequestBody FriendRequest friendRequest) {

        try {
            long result = friendService.sendFriendRequest(friendRequest);
            return ResponseEntity.ok(result);
        }
        catch (InvalidParameterException invalidParameterException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 보낸 친구 신청입니다.");
        }
        catch (IllegalArgumentException illegalArgumentException) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("멤버를 찾을 수 없습니다.");
        }

    }

    @DeleteMapping
    public ResponseEntity<?> deleteFriend(@RequestParam("friendId") long friendId) {
        long result = friendService.deleteFriend(friendId);

        if(result ==0 ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 삭제에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam("messageId") long messageId) {
        long result = friendService.acceptFriendRequest(messageId);

        if(result ==0 ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 수락에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/refuse")
    public ResponseEntity<?> refuseFriendRequest(@RequestParam("messageId") long messageId) {
        long result = friendService.refuseFriendRequest(messageId);

        if(result ==0 ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 거절에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getFriendProfile (@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.extractMemberId(token);
        MemberResponse result = friendService.getFriendProfile(memberId);

        if(result ==null ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 정보 불러오기에 실패했습니다.");
        return ResponseEntity.ok(result);
    }
}
