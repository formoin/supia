package com.forest.supia.item.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class SpeciesDetailResponse {

    private String speciesName;
    private String description;
    private List<ItemResponse> items;

}
