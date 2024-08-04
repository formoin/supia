package com.forest.supia.search.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public interface ItemSearchResponse {
    long getItemId();
    String getSpeciesName();
    String getAddress();
    String getImgUrl();
}
