package com.forest.supia.forest.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ForestItemSoundRequest {
    private long id;
    private long forestId;
    private long itemId;
    private boolean soundOn;
}
