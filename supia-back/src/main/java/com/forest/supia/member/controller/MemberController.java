package com.forest.supia.member.controller;

import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.member.service.MemberService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/members", produces = "application/json; charset=utf8")
public class MemberController {
    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/list")
    public ResponseEntity<List<Member>> listMember(){
        List<Member> memberList = memberService.listMember();
        if(!memberList.isEmpty()) {
            System.out.println(memberList);
            return ResponseEntity.ok(memberList);
        } else{
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerMember(@RequestBody Member member) {
        Member new_member = memberService.createMember(member);

        Map<String, String> response = new HashMap<>();
        if(new_member != null) {
            response.put("message", "회원 등록이 완료되었습니다.");
            return ResponseEntity.ok().body(response);
        } else {
            response.put("message", "회원 등록에 실패하였습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @Transactional
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginMember(@RequestBody Map<String, String> loginInfo) {
        String email = loginInfo.get("email");
        String password = loginInfo.get("password");

        Member member = memberService.findByEmail(email);

        Map<String, String> response = new HashMap<>();

        if (member != null && passwordEncoder.matches(password, member.getPassword())){
            if (member.getVisit() == 0) {
                memberService.updateExp(member.getMemberId());
                response.put("exp", "첫 방문 5 경험치 적립이 완료되었습니다.");
            } else {
                response.put("exp", "이미 방문한 회원입니다.");
            }
            String token = JwtUtil.generateToken(member);
            response.put("token", token);
            response.put("message", "로그인이 완료되었습니다.");
            return ResponseEntity.ok().body(response);
        } else {
            response.put("message", "유효하지 않은 로그인입니다.");
            return ResponseEntity.badRequest().body(response);
        }

    }

    @GetMapping("/social-login")
    public String loginPage() {
        return "login";
    }


    @Transactional
    @PutMapping("/my-info/{memberId}")
    public ResponseEntity<Map<String, String>> modifyMember(@PathVariable("memberId") long memberId, @RequestBody Member member) {
        String name = member.getName();
        String nickname = member.getNickname();
        String profileImg = member.getProfileImg();
        Member modified_member = memberService.updateMember(memberId, name, nickname, profileImg);
        Map<String, String> response = new HashMap<>();
        if (modified_member != null) {
            response.put("message", "회원 정보 수정이 완료되었습니다.");
            return ResponseEntity.ok().body(response);
        } else {
            response.put("message", "회원 정보 수정에 실패하였습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/my-info/{memberId}")
    public ResponseEntity<Map<String, Member>> getMemberInfo(@PathVariable("memberId") long memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        Map<String, Member> response = new HashMap<>();
        if (member != null) {
            response.put("member", member);
            return ResponseEntity.ok().body(response);
        } else {
            response.put("error", member);
            return ResponseEntity.ok().body(response);
        }
    }
}