package com.forest.supia.member.controller;

import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.member.dto.InfoUpdateDto;
import com.forest.supia.member.dto.LoginDto;
import com.forest.supia.member.dto.SignUpDto;
import com.forest.supia.member.entity.Member;
import com.forest.supia.member.repository.MemberRepository;
import com.forest.supia.member.service.MemberService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Autowired
    private JwtUtil jwtUtil;


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
    public ResponseEntity<Map<String, String>> registerMember(@RequestBody SignUpDto signUpInfo) {
        Member check_exist = memberService.findByEmail(signUpInfo.getEmail());
        Map<String, String> response = new HashMap<>();
        if (check_exist == null) {
            Member new_member = memberService.createMember(signUpInfo);

            if(new_member != null) {
                response.put("message", "회원 등록이 완료되었습니다.");
                return ResponseEntity.ok().body(response);
            } else {
                response.put("message", "회원 등록에 실패하였습니다.");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            response.put("message", "이미 가입한 회원입니다.");
            return ResponseEntity.badRequest().body(response);
        }


    }

    @Transactional
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginMember(@RequestBody LoginDto loginInfo) {
        Map<String, String> response = new HashMap<>();

        String token = memberService.loginAndGetToken(loginInfo);
        if (token != null) {
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
    public ResponseEntity<Map<String, String>> modifyMember(@PathVariable("memberId") long memberId,
                                                            @RequestParam("name") String name,
                                                            @RequestParam("nickname") String nickname,
                                                            @RequestParam(value = "profileImg", required = false) MultipartFile profileImg) {
        try {
            String fileUrl = memberService.updateMember(memberId, name, nickname, profileImg);
            Map<String, String> response = new HashMap<>();
            if (fileUrl != null) {
                response.put("message", "회원 정보 수정이 완료되었습니다.");
                response.put("profileImgUrl", fileUrl);
                return ResponseEntity.ok().body(response);
            } else {
                response.put("message", "회원 정보 수정에 실패하였습니다.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/my-info/{memberId}")
    public ResponseEntity<Map<String, Member>> getMemberInfo(@PathVariable("memberId") long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow();
        Map<String, Member> response = new HashMap<>();
        if (member != null) {
            response.put("member", member);
            return ResponseEntity.ok().body(response);
        } else {
            response.put("error", member);
            return ResponseEntity.ok().body(response);
        }
    }

    @PutMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteMember(@RequestHeader("Authorization") String token) {
        Map<String, String> response = new HashMap<>();
        Long memberId = jwtUtil.extractMemberId(token);
        // friend 테이블 member 정보 삭제 (from member, to member 모두 삭제)
        // walk 테이블 memberId 검색 후 삭제
        // own_bgm 삭제
        // item 테이블 memberId를 null로 수정
        // member 테이블 해당 memberId 탈퇴 상태로 수정
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth-test")
    public Long getMemberId(@RequestHeader(value = "Authorization") String token){

        return jwtUtil.extractMemberId(token);
    }
}