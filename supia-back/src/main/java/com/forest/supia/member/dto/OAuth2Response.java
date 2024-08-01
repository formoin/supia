package com.forest.supia.member.dto;

public interface OAuth2Response {

    // google, naver, kakao
    String getProvider();
    // id from provider
    String getProviderId();
    String getEmail();
    String getName();
}
