package com.forest.supia.forest.service;

import com.forest.supia.forest.dto.ForestItemSoundRequest;
import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.dto.ForestSettingRequest;
import com.forest.supia.forest.entity.ForestItem;

public interface ForestService {
    ForestResponse getForest(long memberId);

    void setItemForest(ForestSettingRequest forestSettingRequest) throws Exception;
    void updateSoundForest(ForestItemSoundRequest forestItemSoundRequest);

    void deleteItemForest(long forestItemId);

    void updateForestTheme(long memberId, long itemId, int type);
}
