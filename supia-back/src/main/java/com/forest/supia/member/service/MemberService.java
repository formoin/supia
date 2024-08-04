package com.forest.supia.member.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.forest.supia.member.dto.SignUpDto;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MemberService {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.bucket.url}")
    private String url;

    public MemberService(AmazonS3Client amazonS3Client) {
        this.amazonS3Client = amazonS3Client;
    }

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



    public Member updateMember(long memberId, String name, String nickname, MultipartFile profileImg) throws IOException, java.io.IOException {
        Member member = memberRepository.findByMemberId(memberId);

        if(member != null) {
            if (profileImg != null && !profileImg.isEmpty()) {
                String fileName = "profile/" + memberId + ".png";
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(profileImg.getContentType());
                metadata.setContentLength(profileImg.getSize());
                amazonS3Client.putObject(bucket, fileName, profileImg.getInputStream(), metadata);

                String fileUrl = url + "/" + fileName;
                member.updateMemberInfo(name, nickname, fileUrl);
            }
            return memberRepository.save(member);
        } else {
            return null;
        }
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