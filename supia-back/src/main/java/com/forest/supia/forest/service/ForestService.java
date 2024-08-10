package com.forest.supia.forest.service;

import com.forest.supia.forest.dto.ForestItemSoundRequest;
import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.dto.ForestSettingRequest;
import com.forest.supia.forest.entity.ForestItem;

public interface ForestService {
    ForestResponse getForest(long memberId);

    void setItemForest(ForestSettingRequest forestSettingRequest) throws Exception;
    ForestItem updateSoundForest(ForestItemSoundRequest forestItemSoundRequest);

    boolean deleteItemForest(long forestItemId);

    long updateForestTheme(long memberId, long itemId, int type);
}
