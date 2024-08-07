package com.forest.supia.forest.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ForestSettingRequest {
    private long forestId;
    private List<ForestItemSettingRequest> forestItemSettingRequestList;
}
