package com.forest.supia.background.controller;

import com.forest.supia.background.dto.OwnResponseDto;
import com.forest.supia.background.entity.Bgi;
import com.forest.supia.background.entity.Bgm;
import com.forest.supia.background.service.BgiService;
import com.forest.supia.background.service.BgmService;
import com.forest.supia.background.service.OwnBgiService;
import com.forest.supia.background.service.OwnBgmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/background")
public class BackgroundController {
    @Autowired
    private BgmService bgmService;

    @Autowired
    private BgiService bgiService;

    @Autowired
    private OwnBgmService ownBgmService;

    @Autowired
    private OwnBgiService ownBgiService;

    @GetMapping("/bgm")
    public ResponseEntity<List<Bgm>> getAllBgms() {
        List<Bgm> bgm_list = bgmService.getAllBgms();
        if (bgm_list != null) {
            return ResponseEntity.ok(bgm_list);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/bgi")
    public ResponseEntity<List<Bgi>> getAllBgis() {
         List<Bgi> bgi_list = bgiService.getAllBgis();
         if(bgi_list != null) {
             return ResponseEntity.ok(bgi_list);
         } else {
             return ResponseEntity.badRequest().body(null);
         }
    }
    @PostMapping("/purchase/bgm")
    public void purchaseBgm(@RequestParam("memberId") Long memberId, @RequestParam("bgmId") Long bgmId) {
        ownBgmService.purchaseBgm(memberId, bgmId);
    }

    @PostMapping("/purchase/bgi")
    public void purchaseBgi(@RequestParam("memberId") Long memberId, @RequestParam("bgiId") Long bgiId) {
        ownBgiService.purchaseBgi(memberId, bgiId);
    }

    @GetMapping("/own-bgm")
    public List<OwnResponseDto> getMemberOwnBgms(@RequestParam("memberId") Long memberId) {
        return ownBgmService.getOwnBgms(memberId);
    }

    @GetMapping("/own-bgi")
    public List<OwnResponseDto> getMemberOwnBgis(@RequestParam("memberId") Long memberId) {
        return ownBgiService.getOwnBgis(memberId);
    }


}
