package com.forest.supia.forest.service;

import com.forest.supia.forest.dto.ForestItemSoundRequest;
import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.forest.dto.ForestSettingRequest;
import org.springframework.web.multipart.MultipartFile;

public interface ForestService {
    ForestResponse getForest(long memberId);

    void setItemForest(ForestSettingRequest forestSettingRequest, MultipartFile thumbnail) throws Exception;
    void updateSoundForest(ForestItemSoundRequest forestItemSoundRequest);

    void deleteItemForest(long forestItemId);

    void updateForestTheme(long memberId, long itemId, int type);
}
