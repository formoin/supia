package com.forest.supia.message.service;

import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.item.entity.Item;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.message.dto.GiftRequest;
import com.forest.supia.message.dto.GiftResponse;
import com.forest.supia.message.dto.MessageRequest;
import com.forest.supia.message.dto.MessageResponse;
import com.forest.supia.message.entity.Message;
import com.forest.supia.message.repository.MessageRepository;
import com.forest.supia.notification.service.NotificationService;
import jakarta.persistence.PersistenceException;
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
    public void sendMessage(MessageRequest messageRequest) {

        Member fromMember = memberRepository.findById(messageRequest.getFromMemberId()).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        Member toMember = memberRepository.findById(messageRequest.getToMemberId()).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        Message message = Message.createMessage(fromMember, toMember, 1, messageRequest.getContent());

        try {
            messageRepository.save(message);

            int body = messageRepository.findByToMemberAndCategoryAndIsCheckAndToMemberDelete(toMember, 1, false, false).orElse(new ArrayList<>()).size();
            notificationService.notifyMessage(toMember.getId(), body, "SSE", "message");
        }
        catch (PersistenceException e) {
            throw new ExceptionResponse(CustomException.FAIL_SAVE_MESSAGE_EXCEPTION);
        }

    }

    @Override
    public List<MessageResponse> getMessageBox(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        List<Message> messages = messageRepository.findByToMemberAndCategoryAndToMemberDelete(member, 1, false).orElse(new ArrayList<>());

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
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        List<Message> messages = messageRepository.findByFromMemberAndCategoryAndFromMemberDelete(member, 1, false).orElse(new ArrayList<>());

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
        Message message = messageRepository.findById(messageId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MESSAGE_EXCEPTION));

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

        try {

            messageRepository.save(message);
        }
        catch (PersistenceException e) {
            throw new ExceptionResponse(CustomException.FAIL_SAVE_MESSAGE_EXCEPTION);
        }
        return messageResponse;
    }

    @Override
    public void deleteMessage(long messageId, long memberId) {
        try{
            Message message = messageRepository.findById(messageId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MESSAGE_EXCEPTION));

            message.delete(message, memberId);
            messageRepository.save(message);

        }
        catch (PersistenceException e) {
            throw new ExceptionResponse(CustomException.FAIL_SAVE_MESSAGE_EXCEPTION);
        }

    }

    @Override
    public List<MessageResponse> getNotificationBox(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        List<Message> messages = messageRepository.findByToMemberAndCategoryGreaterThan(member, 2).orElse(new ArrayList<>());

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
            try {
                messageRepository.save(message);
            }
            catch (PersistenceException e) {
                throw new ExceptionResponse(CustomException.FAIL_SAVE_MESSAGE_EXCEPTION);
            }
        }
        return messageResponses;

    }

    @Override
    public long sendGift(GiftRequest giftRequest) {
        Member fromMember = memberRepository.findById(giftRequest.getFromMemberId()).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        Member toMember = memberRepository.findById(giftRequest.getToMemberId()).orElseThrow(() -> new InvalidParameterException("Cannot find member"));

        Item item = itemRepository.findById(giftRequest.getItemId()).orElseThrow(()-> new ExceptionResponse(CustomException.NOT_FOUND_ITEM_EXCEPTION));
        item.setMember(null);

        System.out.println(item.getId() + " " + item.getMember());
        itemRepository.save(item);
        Message message = Message.createMessage(fromMember, toMember, 2, item.getImgUrl());

        messageRepository.save(message);
        int body = messageRepository.findByToMemberAndCategoryGreaterThanAndIsCheck(toMember, 1, false).orElse(new ArrayList<>()).size();

        notificationService.notifyMessage(toMember.getId(), body, "SSE", "alarm");
        return message.getId();
    }

    @Override
    public List<GiftResponse> getGiftBox(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        List<Message> messages = messageRepository.findByToMemberAndCategory(member, 2).orElse(new ArrayList<>());

        List<GiftResponse> giftResponses = new ArrayList<>();
        for(Message message : messages) {

            GiftResponse messageResponse = new GiftResponse();

            try {

                Item item = itemRepository.findByImgUrl(message.getContent());


                messageResponse.setMessageId(message.getId());
                messageResponse.setFromMemberNickname(message.getFromMember().getNickname());
                messageResponse.setFromMemberImg(message.getFromMember().getProfileImg());
                messageResponse.setContent(item.getImgUrl());
                messageResponse.setSpecies(item.getSpecies().getName());
                messageResponse.setSentTime(message.getSentTime());
            }
            catch (PersistenceException e){
                throw new ExceptionResponse(CustomException.NOT_FOUND_ITEM_EXCEPTION);
            }
            giftResponses.add(messageResponse);

            message.check(message, memberId);
            try {
                messageRepository.save(message);
            }
            catch (PersistenceException e) {
                throw new ExceptionResponse(CustomException.FAIL_SAVE_MESSAGE_EXCEPTION);
            }
        }
        return giftResponses;
    }

    @Override
    public void acceptGift(long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new InvalidParameterException("Cannot find message"));
        String url = message.getContent();
        Item item = itemRepository.findByImgUrl(url);
        item.setMember(message.getToMember());

        itemRepository.save(item);
        messageRepository.deleteById(messageId);
    }

    @Override
    public void refuseGift(long messageId) {
        messageRepository.deleteById(messageId);

    }
}
