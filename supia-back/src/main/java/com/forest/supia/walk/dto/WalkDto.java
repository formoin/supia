package com.forest.supia.walk.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.forest.supia.item.dto.ItemDto;
import com.forest.supia.item.entity.Item;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
public class WalkDto {
    private Long id;

    private Long memberId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime walkStart;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime walkEnd;
    private Long distance;

    private List<ItemDto> items;
}
