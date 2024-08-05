package com.forest.supia.background.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PurchaseResponseDto {
    private Long memberId;
    private Long itemId;
    private int price;
    private int remainingPoints;
    private String type;
}