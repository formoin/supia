package com.forest.supia.background.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
public class OwnResponseDto {
    private Long itemId;
    private Long memberId;
    private String name;
    private String path;

    public OwnResponseDto(Long itemId, Long memberId, String name, String path) {
        this.itemId = itemId;
        this.memberId = memberId;

        this.name = name;
        this.path = path;
    }

}