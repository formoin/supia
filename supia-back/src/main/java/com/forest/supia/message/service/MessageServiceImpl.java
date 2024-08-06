package com.forest.supia.message.service;

import com.forest.supia.item.entity.Item;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;
import com.forest.supia.message.entity.Message;
import com.forest.supia.message.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService{
    private final MemberRepository memberRepository;
    private final MessageRepository messageRepository;
    private final ItemRepository itemRepository;

    @Override
    public long sendMessage(MessageRequest messageRequest) {

        Member fromMember = memberRepository.findById(messageRequest.getFromMemberId()).orElseThrow();
        Member toMember = memberRepository.findById(messageRequest.getToMemberId()).orElseThrow();

        Message message = Message.createMessage(fromMember, toMember, 1, messageRequest.getContent());

        messageRepository.save(message);

        return message.getId();
    }

    @Override
    public long sendGift(GiftRequest giftRequest) {
        Member fromMember = memberRepository.findById(giftRequest.getFromMemberId()).orElseThrow();
        Member toMember = memberRepository.findById(giftRequest.getToMemberId()).orElseThrow();

        Item item = itemRepository.findById(giftRequest.getItemId());
        Message message = Message.createMessage(fromMember, toMember, 2, item.getImgUrl());

        messageRepository.save(message);

        return message.getId();
    }

    @Override
    public List<MessageResponse> getMessageBox(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        List<Message> messages = messageRepository.findByToMember(member);

        List<MessageResponse> messageResponses = new ArrayList<>();
        for(Message message : messages) {
            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setMessageId(message.getId());
            messageResponse.setCategory(message.getCategory());
            messageResponse.setFromMemberId(message.getFromMember().getId());
            messageResponse.setContent(message.getContent());
            messageResponse.setSentTime(message.getSentTime());

            messageResponses.add(messageResponse);
        }
        return messageResponses;
    }

    @Override
    public MessageResponse getMessageDetail(long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow();

        message.check(message);
        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessageId(messageId);
        messageResponse.setCategory(message.getCategory());
        messageResponse.setContent(message.getContent());
        messageResponse.setFromMemberId(message.getFromMember().getId());
        messageResponse.setSentTime(message.getSentTime());

        return messageResponse;
    }

    @Override
    public long deleteMessage(long messageId) {
        try{
            messageRepository.deleteById(messageId);
            return 1;
        }
        catch (Exception e){
            return 0;
        }
    }
}
