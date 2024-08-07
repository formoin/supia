package com.forest.supia.message.service;

import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;

import java.util.List;

public interface MessageService {

    // message
    public long sendMessage(MessageRequest messageRequest);

    public List<MessageResponse> getMessageBox(long memberId);
    public List<MessageResponse> getSenderMessageBox(long memberId);
    public MessageResponse getMessageDetail(long messageId, long memberId);

    public long deleteMessage(long messageId, long memberId);

    // notification
    public long sendGift(GiftRequest giftRequest);

    public List<MessageResponse> getNotificationBox(long memberId);

    public long acceptGift(long messageId);
    public long refuseGift(long messageId);
}
