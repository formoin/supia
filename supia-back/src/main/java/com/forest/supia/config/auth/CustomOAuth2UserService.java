package com.forest.supia.config.auth;

import com.forest.supia.member.model.*;
import com.forest.supia.member.repository.MemberRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;


@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    public CustomOAuth2UserService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        }
        else if(registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else {
            return null;
        }

        String email = oAuth2Response.getEmail();
        Member existData = memberRepository.findByEmail(email);

        String role = "ROLE_USER";

        if(existData == null) {
            Member member = new Member();
            member.setEmail(oAuth2Response.getEmail());
            member.setPassword(null);
            member.setName(oAuth2Response.getName());
            member.setNickname(null);
            member.setProfileImg(null);

            memberRepository.save(member);
        }
        else {
            existData.setEmail(oAuth2Response.getEmail());
            memberRepository.save(existData);
        }

        return new CustomOAuth2User(oAuth2Response, role);
    }
}