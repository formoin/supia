package com.forest.supia.notification.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SampleSseResponse {
    private String name;
    private String message;
}
