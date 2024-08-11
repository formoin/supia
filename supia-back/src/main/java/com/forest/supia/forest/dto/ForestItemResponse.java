package com.forest.supia.forest.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ForestItemResponse {

    private long id;
    private long itemId;
    private double x;
    private double y;
    private String imgUrl;
    private boolean SoundOn;
    private String soundUrl;
}
