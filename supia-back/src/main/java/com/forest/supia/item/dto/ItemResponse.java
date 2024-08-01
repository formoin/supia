package com.forest.supia.item.dto;

import java.time.LocalDate;


public interface ItemResponse {
    long getId();
    String getImgUrl();
    LocalDate getAcquireDate();


}
