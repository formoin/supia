package com.forest.supia.openvidu.service;

import com.forest.supia.exception.CustomException;
import com.forest.supia.exception.ExceptionResponse;
import com.forest.supia.member.dto.MemberResponse;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OpenviduService {
    private final NotificationService notificationService;
    private final MemberRepository memberRepository;


    public void sendNotification(long fromMemberId, long toMemberId) {
        Member fromMember = memberRepository.findById(fromMemberId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        MemberResponse memberResponse = new MemberResponse();
        memberResponse.setMemberId(fromMemberId);
        memberResponse.setName(fromMember.getName());
        memberResponse.setNickname(fromMember.getNickname());
        memberResponse.setProfileImg(fromMember.getProfileImg());

        notificationService.sendToClient(toMemberId, memberResponse, "SSE", "call");

    }



}
