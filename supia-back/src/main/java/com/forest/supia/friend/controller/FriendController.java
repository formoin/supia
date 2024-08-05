package com.forest.supia.friend.controller;

import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.friend.dto.FriendResponse;
import com.forest.supia.friend.service.FriendService;
import com.forest.supia.item.dto.SpeciesResponse;
import com.forest.supia.member.dto.MemberResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friends")
public class FriendController {

    private final FriendService friendService;

    @GetMapping
    public ResponseEntity<?> getFriendsList(@RequestParam("memberId") long memberId) throws Exception {
        List<FriendResponse> getFriendsList = friendService.getFriendsList(memberId);
        if(getFriendsList.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록된 친구가 없습니다.");
        return ResponseEntity.ok(getFriendsList);
    }

    @PostMapping
    public ResponseEntity<?> sendFriendRequest(@RequestBody FriendRequest friendRequest) {
        long result = friendService.sendFriendRequest(friendRequest);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("등록에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam("friendId") long friendId) {
        long result = friendService.acceptFriendRequest(friendId);

        if(result ==0 ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 수락에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteFriend(@RequestParam("friendId") long friendId) {
        long result = friendService.deleteFriend(friendId);

        if(result ==0 ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 삭제에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getFriendProfile(@RequestParam("friendId") long friendId, @RequestParam("memberId") long memberId) {
        MemberResponse result = friendService.getFriendProfile(friendId, memberId);

        if(result ==null ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 삭제에 실패했습니다.");
        return ResponseEntity.ok(result);
    }
}
