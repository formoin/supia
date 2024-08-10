package com.forest.supia.message.service;

import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.GiftResponse;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;

import java.util.List;

public interface MessageService {

    // message
     void sendMessage(MessageRequest messageRequest);

     List<MessageResponse> getMessageBox(long memberId);
     List<MessageResponse> getSenderMessageBox(long memberId);
     MessageResponse getMessageDetail(long messageId, long memberId);

     void deleteMessage(long messageId, long memberId);

    // notification
     long sendGift(GiftRequest giftRequest);

    List<GiftResponse> getGiftBox(long memberId);
     List<MessageResponse> getNotificationBox(long memberId);

     void acceptGift(long messageId);
     void refuseGift(long messageId);
}
