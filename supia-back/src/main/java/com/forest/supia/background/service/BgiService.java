package com.forest.supia.background.service;

import com.forest.supia.background.entity.Bgi;
import com.forest.supia.background.repository.BgiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class BgiService {

    @Autowired
    private BgiRepository bgiRepository;

    public List<Bgi> getAllBgis() {
        return bgiRepository.findAll();
    }
}