package com.forest.supia.item.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class ItemDetailResponse {

    private String speciesName;
    private String img;
    private String description;
    private LocalDate acquireDate;
}
