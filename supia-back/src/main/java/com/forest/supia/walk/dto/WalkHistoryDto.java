package com.forest.supia.walk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class WalkHistoryDto {
    private Date walkDate;
    private Long walkHour;
}
