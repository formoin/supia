package com.forest.supia.message.controller;

import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.exception.CustomException;
import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.GiftResponse;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;
import com.forest.supia.message.service.MessageService;
import com.forest.supia.notification.service.NotificationService;
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
    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;
    // 메세지 보내기
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest messageRequest) {
        messageService.sendMessage(messageRequest);

        return ResponseEntity.ok("메세지 발신 성공");
    }

    // 메세지함
    @GetMapping("/to")
    public ResponseEntity<?> messageBox(@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.extractMemberId(token);
        List<MessageResponse> result = messageService.getMessageBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CustomException.NOT_FOUND_MESSAGE_EXCEPTION);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/from")
    public ResponseEntity<?> senderMessageBox(@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.extractMemberId(token);
        List<MessageResponse> result = messageService.getSenderMessageBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CustomException.NOT_FOUND_MESSAGE_EXCEPTION);
        return ResponseEntity.ok(result);
    }

    // 메세지 세부 정보
    // 선물 크게 보기
    @GetMapping("/detail")
    public ResponseEntity<?> messageDetail(@RequestParam("messageId") long messageId, @RequestHeader("Authorization") String token) {

        long memberId = jwtUtil.extractMemberId(token);

        MessageResponse result = messageService.getMessageDetail(messageId, memberId);
        
        return ResponseEntity.ok(result);
    }
    // 메세지 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteMessage(@RequestParam("messageId") long messageId, @RequestHeader("Authorization") String token) {

        long memberId = jwtUtil.extractMemberId(token);
        messageService.deleteMessage(messageId, memberId);


        return ResponseEntity.ok("메세지 삭제 성공");
    }


    // 알림함 확인
    @GetMapping("/notification-box")
    public ResponseEntity<?> notificationBox(@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.extractMemberId(token);
        List<MessageResponse> result = messageService.getNotificationBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("알림함이 비었습니다.");
        return ResponseEntity.ok(result);
    }

    // 선물함 확인
    @GetMapping("/gift-box")
    public ResponseEntity<?> giftBox(@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.extractMemberId(token);
        List<GiftResponse> result = messageService.getGiftBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("선물함이 비었습니다.");
        return ResponseEntity.ok(result);
    }

    // 선물 보내기
    @PostMapping("/gift")
    public ResponseEntity<?> sendGift(@RequestBody GiftRequest giftRequest) {
        long result = messageService.sendGift(giftRequest);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("선물 전송에 실패했습니다.");
        return ResponseEntity.ok(result);
    }
    

    // 선물 수락하기
    @GetMapping("/gift")
    public ResponseEntity<?> acceptGift(@RequestParam("messageId") long messageId) {
        messageService.acceptGift(messageId);
        
        return ResponseEntity.ok("선물 수락 성공");
    }

    // 선물 거절하기
    @DeleteMapping("/gift")
    public ResponseEntity<?> refuseGift(@RequestParam("messageId") long messageId) {
        messageService.refuseGift(messageId);

        
        return ResponseEntity.ok("선물 거절 성공");
    }

    

}
