package com.forest.supia.forest.service;

import com.forest.supia.forest.dto.ForestItemRequest;
import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.entity.ForestItem;

public interface ForestService {
    ForestResponse getForest(long memberId);

    ForestItem setItemToForest(ForestItemRequest forestItemRequest);
}
