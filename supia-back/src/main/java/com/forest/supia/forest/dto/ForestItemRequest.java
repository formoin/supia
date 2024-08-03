package com.forest.supia.forest.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ForestItemRequest {
    private long forestId;
    private long itemId;
    private double x;
    private double y;
    private boolean soundOn;
}
