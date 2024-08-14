package com.forest.supia.member.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.forest.supia.background.repository.OwnBgiRepository;
import com.forest.supia.background.repository.OwnBgmRepository;
import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.config.s3.DefaultPropertiesConfig;
import com.forest.supia.forest.entity.Forest;
import com.forest.supia.forest.repository.ForestItemRepository;
import com.forest.supia.forest.repository.ForestRepository;
import com.forest.supia.friend.repository.FriendRepository;
import com.forest.supia.item.repository.ItemRepository;
import com.forest.supia.member.dto.LoginDto;
import com.forest.supia.member.dto.MemberInfoResponse;
import com.forest.supia.member.dto.SignUpDto;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.message.repository.MessageRepository;
import com.forest.supia.walk.repository.WalkRepository;
import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private WalkRepository walkRepository;

    @Autowired
    private ForestRepository forestRepository;

    @Autowired
    private ForestItemRepository forestItemRepository;

    @Autowired
    private OwnBgiRepository ownBgiRepository;

    @Autowired
    private OwnBgmRepository ownBgmRepository;

    @Autowired
    private ItemRepository itemRepository;


    @Autowired
    private MessageRepository messageRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    private final AmazonS3Client amazonS3Client;

    @Autowired
    private DefaultPropertiesConfig defaultPropertiesConfig;

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
                .profileImg(defaultPropertiesConfig.getDefaultProfileImg())
                .isActive(true)
                .build();

        Member member = memberRepository.save(new_member);

        Forest forest = Forest.createForest(member, defaultPropertiesConfig.getDefaultThumbnail(), defaultPropertiesConfig.getDefaultBgi());


        forestRepository.save(forest);

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

    @Transactional
    public void deleteMember(Long memberId) {
        // memberId에 해당하는 회원을 조회
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));

        // friend 테이블 member 정보 삭제 (from member, to member 모두 삭제)
        friendRepository.deleteByFromMember_Id(memberId);
        friendRepository.deleteByToMember_Id(memberId);

        // walk 테이블 memberId 검색 후 삭제
        walkRepository.deleteByMember_Id(memberId);

        // forest, forest_item 삭제
        Forest forest = forestRepository.findByMember_Id(memberId);
        if (forest != null) {
            forestItemRepository.deleteByForest_Id(forest.getId());
            forestRepository.deleteById(forest.getId());
        }

        // own_bgi, own_bgm 삭제
        ownBgiRepository.deleteByMember_Id(memberId);
        ownBgmRepository.deleteByMember_Id(memberId);

        // 해당 memberId로 할당된 item 테이블 memberId를 null로 수정
        itemRepository.updateMemberIdToNull(memberId);

        // member 테이블 memberId에 해당하는 데이터 탈퇴 상태로 수정 (isActive = false)
        member.setActive(false);
        memberRepository.save(member); //를 호출하지 않음, 트랜잭션 종료 시점에 자동으로 반영됨
    }

    public MemberInfoResponse updateMemberInfoResponse(Member member) {
        MemberInfoResponse memberInfo = new MemberInfoResponse();

        int unread = messageRepository.findByToMemberAndCategoryAndIsCheckAndToMemberDelete(member, 1, false, false).orElse(new ArrayList<>()).size();
        int uncheck = messageRepository.findByToMemberAndCategoryGreaterThanAndIsCheck(member, 1, false).orElse(new ArrayList<>()).size();


        memberInfo.setEmail(member.getEmail());
        memberInfo.setId(member.getId());
        memberInfo.setLevel(member.getLevel());
        memberInfo.setExp(member.getExp());
        memberInfo.setName(member.getName());
        memberInfo.setPoint(member.getPoint());
        memberInfo.setNickname(member.getNickname());
        memberInfo.setProfileImg(member.getProfileImg());
        memberInfo.setVisit(member.getVisit());
        memberInfo.setActive(member.isActive());
        memberInfo.setThumbnail(member.getForest().getThumbnail());
        memberInfo.setIsCheckAlarm(uncheck);
        memberInfo.setUnreadMessage(unread);
        return memberInfo;
    }

    @Transactional
    public void resetVisitCounts() {
        memberRepository.resetVisitCount();
    }

    public boolean verifyPassword(Long memberId, String password) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        return passwordEncoder.matches(password, member.getPassword());
    }

    public void updatePassword(Long memberId, String newPassword) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        member.updatePassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);
    }
}