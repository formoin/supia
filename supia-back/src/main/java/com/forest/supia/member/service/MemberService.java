package com.forest.supia.member.service;

import com.forest.supia.member.dto.SignUpDto;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Member> listMember() {
        return memberRepository.findAll();
    }

    public Member createMember (SignUpDto signUpInfo) {
        String encoded_password = passwordEncoder.encode((signUpInfo.getPassword()));
        Member new_member = Member.builder()
                .email(signUpInfo.getEmail())
                .name(signUpInfo.getName())
                .nickname(signUpInfo.getNickname())
                .password(encoded_password)
                .build();
        return memberRepository.save(new_member);
    }

    public Member createSocialMember (String email, String name) {
        Member new_member = Member.builder()
                .email(email)
                .name(name)
                .nickname(name)
                .password(null)
                .build();
        memberRepository.save(new_member);
        return new_member;
    }

    public Member updateMember(Long memberId, String name, String nickname, String profileImg) {
        Member member = memberRepository.findByMemberId(memberId);
        member.updateMemberInfo(name, nickname, profileImg);
        return member;
    }

    public void updateExp(Long memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        member.addExpVisit();
    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Member findByMemberId(long memberId) {
        return memberRepository.findByMemberId(memberId);
    }

}