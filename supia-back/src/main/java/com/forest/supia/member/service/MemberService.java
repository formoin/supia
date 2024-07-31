package com.forest.supia.member.service;

import com.forest.supia.member.model.Member;
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

    public void saveMember(Member member) {
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        memberRepository.save(member);
    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }
}
