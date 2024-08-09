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
import com.forest.supia.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService{
    private final MemberRepository memberRepository;
    private final MessageRepository messageRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;


    @Override
    public long sendMessage(MessageRequest messageRequest) {

        Member fromMember = memberRepository.findById(messageRequest.getFromMemberId()).orElseThrow();
        Member toMember = memberRepository.findById(messageRequest.getToMemberId()).orElseThrow();

        Message message = Message.createMessage(fromMember, toMember, 1, messageRequest.getContent());

        messageRepository.save(message);
        int body = messageRepository.findByToMemberAndCategoryAndIsCheck(toMember, 1, false).size();
        notificationService.notifyMessage(toMember.getId(), body, "SSE", "message");
        return message.getId();
    }

    @Override
    public List<MessageResponse> getMessageBox(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new InvalidParameterException("Cannot find member"));
        List<Message> messages = messageRepository.findByToMemberAndCategoryAndToMemberDelete(member, 1, false);

        List<MessageResponse> messageResponses = new ArrayList<>();
        for(Message message : messages) {
            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setMessageId(message.getId());
            messageResponse.setCategory(message.getCategory());
            messageResponse.setFromMemberNickname(message.getFromMember().getNickname());
            messageResponse.setToMemberNickname(message.getToMember().getNickname());
            messageResponse.setFromMemberImg(message.getFromMember().getProfileImg());
            messageResponse.setToMemberImg(message.getToMember().getProfileImg());
            messageResponse.setCheck(message.isCheck());
            messageResponse.setContent(message.getContent());
            messageResponse.setSentTime(message.getSentTime());

            messageResponses.add(messageResponse);
        }
        return messageResponses;
    }

    @Override
    public List<MessageResponse> getSenderMessageBox(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new InvalidParameterException("Cannot find member"));
        List<Message> messages = messageRepository.findByFromMemberAndCategoryAndFromMemberDelete(member, 1, false);

        List<MessageResponse> messageResponses = new ArrayList<>();
        for(Message message : messages) {
            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setMessageId(message.getId());
            messageResponse.setCategory(message.getCategory());
            messageResponse.setFromMemberNickname(message.getFromMember().getNickname());
            messageResponse.setToMemberNickname(message.getToMember().getNickname());
            messageResponse.setFromMemberImg(message.getFromMember().getProfileImg());
            messageResponse.setToMemberImg(message.getToMember().getProfileImg());
            messageResponse.setCheck(message.isCheck());
            messageResponse.setContent(message.getContent());
            messageResponse.setSentTime(message.getSentTime());

            messageResponses.add(messageResponse);
        }
        return messageResponses;
    }

    @Override
    public MessageResponse getMessageDetail(long messageId, long memberId) {
        Message message = messageRepository.findById(messageId).orElseThrow();

        message.check(message, memberId);
        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessageId(messageId);
        messageResponse.setCategory(message.getCategory());
        messageResponse.setContent(message.getContent());
        messageResponse.setFromMemberNickname(message.getFromMember().getNickname());
        messageResponse.setToMemberNickname(message.getToMember().getNickname());
        messageResponse.setFromMemberImg(message.getFromMember().getProfileImg());
        messageResponse.setToMemberImg(message.getToMember().getProfileImg());
        messageResponse.setSentTime(message.getSentTime());
        messageResponse.setCheck(message.isCheck());

        messageRepository.save(message);
        return messageResponse;
    }

    @Override
    public long deleteMessage(long messageId, long memberId) {
        try{
            Message message = messageRepository.findById(messageId).orElseThrow(() -> new InvalidParameterException("Cannot find Message"));

            message.delete(message, memberId);
            messageRepository.save(message);
            return message.getId();
        }
        catch (InvalidParameterException e) {
            return 0;
        }

    }

    @Override
    public List<MessageResponse> getNotificationBox(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new InvalidParameterException("Cannot find member"));
        List<Message> messages = messageRepository.findByToMemberAndCategoryGreaterThan(member, 1);

        List<MessageResponse> messageResponses = new ArrayList<>();
        for(Message message : messages) {

            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setMessageId(message.getId());
            messageResponse.setCategory(message.getCategory());
            messageResponse.setFromMemberNickname(message.getFromMember().getNickname());
            messageResponse.setToMemberNickname(message.getToMember().getNickname());
            messageResponse.setFromMemberImg(message.getFromMember().getProfileImg());
            messageResponse.setToMemberImg(message.getToMember().getProfileImg());
            messageResponse.setCheck(message.isCheck());
            messageResponse.setContent(message.getContent());
            messageResponse.setSentTime(message.getSentTime());

            messageResponses.add(messageResponse);

            message.check(message, memberId);
            messageRepository.save(message);
        }
        return messageResponses;

    }

    @Override
    public long sendGift(GiftRequest giftRequest) {
        Member fromMember = memberRepository.findById(giftRequest.getFromMemberId()).orElseThrow(() -> new InvalidParameterException("Cannot find member"));
        Member toMember = memberRepository.findById(giftRequest.getToMemberId()).orElseThrow(() -> new InvalidParameterException("Cannot find member"));

        Item item = itemRepository.findById(giftRequest.getItemId());
        item.setMember(null);

        System.out.println(item.getId() + " " + item.getMember());
        itemRepository.save(item);
        Message message = Message.createMessage(fromMember, toMember, 2, item.getImgUrl());

        messageRepository.save(message);
        int body = messageRepository.findByToMemberAndCategoryGreaterThanAndIsCheck(toMember, 1, false).size();

        notificationService.notifyMessage(toMember.getId(), body, "SSE", "alarm");
        return message.getId();
    }

    @Override
    public long acceptGift(long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new InvalidParameterException("Cannot find message"));
        String url = message.getContent();
        Item item = itemRepository.findByImgUrl(url);
        item.setMember(message.getToMember());

        itemRepository.save(item);
        return item.getId();
    }

    @Override
    public long refuseGift(long messageId) {

        messageRepository.deleteById(messageId);

        return 1;
    }
}
