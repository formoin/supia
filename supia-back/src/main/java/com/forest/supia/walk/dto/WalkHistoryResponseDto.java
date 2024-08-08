package com.forest.supia.walk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.YearMonth;

@Data
@AllArgsConstructor
public class WalkHistoryResponseDto {
    private LocalDate walkDate;
    private YearMonth month;
    private double totalDistance;

    public WalkHistoryResponseDto(LocalDate walkDate, double totalDistance) {
        this.walkDate = walkDate;
        this.totalDistance = totalDistance;
    }

    public WalkHistoryResponseDto(int year, int month, double totalDistance) {
        this.month = YearMonth.of(year, month);
        this.totalDistance = totalDistance;
    }
}
