package com.forest.supia.background.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
public class OwnResponseDto {
    private Long memberId;
    private String name;
    private String path;

    public OwnResponseDto(Long memberId, String name, String path) {
        this.memberId = memberId;
        this.name = name;
        this.path = path;
    }

}