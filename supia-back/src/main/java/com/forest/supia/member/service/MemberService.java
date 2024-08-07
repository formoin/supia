package com.forest.supia.member.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.repository.ForestRepository;
import com.forest.supia.member.dto.LoginDto;
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
    private ForestRepository forestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final AmazonS3Client amazonS3Client;

    @Autowired
    private JwtUtil jwtUtil;

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

    public String loginAndGetToken(LoginDto loginInfo) {
        String email = loginInfo.getEmail();
        String password = loginInfo.getPassword();
        Member member = findByEmail(email);

        if (member != null && passwordEncoder.matches(password, member.getPassword())) {
            String token = jwtUtil.generateToken(member);
            member.updateToken(token); // updateToken 메서드 사용
            memberRepository.save(member);
            return token;
        }
        return null;
    }

    public Member createMember (SignUpDto signUpInfo) {
        String encoded_password = passwordEncoder.encode((signUpInfo.getPassword()));
        Member new_member = Member.builder()
                .email(signUpInfo.getEmail())
                .name(signUpInfo.getName())
                .nickname(signUpInfo.getNickname())
                .password(encoded_password)
                .build();

        Member member = memberRepository.save(new_member);
        Forest forest = Forest.createForest(member, "Default thumbnail");
        forestRepository.save(forest);

        Forest result = forestRepository.save(forest);

        return member;
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



    public String updateMember(long memberId, String name, String nickname, MultipartFile profileImg) throws IOException, java.io.IOException {
        Member member = memberRepository.findById(memberId).orElseThrow();

        if(member != null) {
            if (profileImg != null && !profileImg.isEmpty()) {
                String fileName = "profile/" + memberId + ".png";
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(profileImg.getContentType());
                metadata.setContentLength(profileImg.getSize());
                amazonS3Client.putObject(bucket, fileName, profileImg.getInputStream(), metadata);

                String fileUrl = url + "/" + fileName;
                member.updateMemberInfo(name, nickname, fileUrl);

                memberRepository.save(member);
                return fileUrl;
            } else {
                memberRepository.save(member);
                return "modify completed without profile";
            }
        } else {
            return null;
        }
    }

    public void updateExp(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        member.addExpVisit();
    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Member findByMemberId(long memberId) {
        return memberRepository.findById(memberId).orElseThrow();
    }

}