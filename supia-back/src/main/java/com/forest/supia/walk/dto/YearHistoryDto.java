package com.forest.supia.walk.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Month;
import java.util.Date;

@Getter
@Setter
public class YearHistoryDto {
    private Month month;
    private Long walkHour;
}
