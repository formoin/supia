package com.forest.supia.background.controller;

import com.forest.supia.background.dto.OwnResponseDto;
import com.forest.supia.background.dto.PurchaseResponseDto;
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
    public ResponseEntity<PurchaseResponseDto> purchaseBgm(@RequestParam("memberId") Long memberId, @RequestParam("bgmId") Long bgmId) {
        try {
            PurchaseResponseDto response = ownBgmService.purchaseBgm(memberId, bgmId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/purchase/bgi")
    public ResponseEntity<PurchaseResponseDto> purchaseBgi(@RequestParam("memberId") Long memberId, @RequestParam("bgiId") Long bgiId) {
        try {
            PurchaseResponseDto response = ownBgiService.purchaseBgi(memberId, bgiId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
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
