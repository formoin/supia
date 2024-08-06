package com.forest.supia.message.controller;

import com.forest.supia.friend.dto.FriendRequest;
import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;
import com.forest.supia.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    // 메세지 보내기
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest messageRequest) {
        long result = messageService.sendMessage(messageRequest);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("등록에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    // 메세지함
    @GetMapping("/to")
    public ResponseEntity<?> messageBox(@RequestParam("memberId") long memberId) {
        List<MessageResponse> result = messageService.getMessageBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메세지함이 비었습니다.");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/from")
    public ResponseEntity<?> senderMessageBox(@RequestParam("memberId") long memberId) {
        List<MessageResponse> result = messageService.getSenderMessageBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메세지함이 비었습니다.");
        return ResponseEntity.ok(result);
    }

    // 메세지 세부 정보
    // 선물 크게 보기
    @GetMapping("/detail")
    public ResponseEntity<?> messageDetail(@RequestParam("messageId") long messageId, @RequestParam("memberId") long memberId) {
        MessageResponse result = messageService.getMessageDetail(messageId, memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메세지 확인에 실패했습니다.");
        return ResponseEntity.ok(result);
    }
    // 메세지 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteMessage(@RequestParam("messageId") long messageId, @RequestParam("memberId") long memberId) {
        long result = messageService.deleteMessage(messageId, memberId);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메세지 삭제에 실패했습니다.");
        return ResponseEntity.ok(result);
    }



    // 선물 보내기
    @PostMapping("/gift")
    public ResponseEntity<?> sendGift(@RequestBody GiftRequest giftRequest) {
        long result = messageService.sendGift(giftRequest);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("선물 전송에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    // 알림함 확인
    @GetMapping("/notification")
    public ResponseEntity<?> notificationBox(@RequestParam("memberId") long memberId) {
        List<MessageResponse> result = messageService.getNotificationBox(memberId);

        if(result==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("알림함이 비었습니다.");
        return ResponseEntity.ok(result);
    }




    // 선물 수락하기
    @GetMapping("/gift")
    public ResponseEntity<?> acceptGift(@RequestParam("messageId") long messageId) {
        long result = messageService.acceptGift(messageId);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("선물 수락에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

    // 선물 거정하기
    @DeleteMapping("/gift")
    public ResponseEntity<?> refuseGift(@RequestParam("messageId") long messageId) {
        long result = messageService.refuseGift(messageId);

        if(result==0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("선물 수락에 실패했습니다.");
        return ResponseEntity.ok(result);
    }

//    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public ResponseEntity<?> connect(
//            @RequestHeader(value = "")
//    )
}
