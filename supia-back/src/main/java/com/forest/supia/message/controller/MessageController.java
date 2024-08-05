package com.forest.supia.message.controller;

import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;
import com.forest.supia.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;


    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest messageRequest) {
        long result = messageService.sendMessage(messageRequest);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("등록에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<?> messageBox(@RequestParam("memberId") long memberId) {
        List<MessageResponse> result = messageService.getMessageBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메세지함이 비었습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> messageDetail(@RequestParam("messageId") long messageId) {
        MessageResponse result = messageService.getMessageDetail(messageId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메세지 확인에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/gift")
    public ResponseEntity<?> sendGift(@RequestBody GiftRequest giftRequest) {
        long result = messageService.sendGift(giftRequest);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("선물 전송에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteMessage(@RequestParam("messageId") long messageId) {
        long result = messageService.deleteMessage(messageId);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("선물 전송에 실패했습니다.");
        return ResponseEntity.ok(result);
    }
}
