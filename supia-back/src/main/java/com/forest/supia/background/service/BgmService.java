package com.forest.supia.background.service;

import com.forest.supia.background.entity.Bgm;
import com.forest.supia.background.repository.BgmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BgmService {

    @Autowired
    private BgmRepository bgmRepository;

    public List<Bgm> getAllBgms() {
        return bgmRepository.findAll();
    }
}