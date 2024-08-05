package com.forest.supia.message.service;

import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;

import java.util.List;

public interface MessageService {
    public long sendMessage(MessageRequest messageRequest);

    public long sendGift(GiftRequest giftRequest);
    public List<MessageResponse> getMessageBox(long memberId);

    public MessageResponse getMessageDetail(long messageId);

    public long deleteMessage(long messageId);
}
