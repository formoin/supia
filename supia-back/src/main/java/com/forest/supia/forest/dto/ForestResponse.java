package com.forest.supia.forest.dto;

import com.forest.supia.forest.entity.ForestItem;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ForestResponse {
    private long forestId;
    private String music;
    private String theme;
    private List<ForestItemResponse> items;

}
