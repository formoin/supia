package com.forest.supia.member.service;

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


    public Long saveMember(Member memberInfo) {
        String encoded = passwordEncoder.encode((memberInfo.getPassword()));
        Member member = Member.createMember(memberInfo.getEmail(), memberInfo.getName(), memberInfo.getNickname(), encoded);

        memberRepository.save(member);
        return member.getMemberId();

    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }


}
