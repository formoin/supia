package com.forest.supia.background.controller;

import com.forest.supia.background.dto.OwnResponseDto;
import com.forest.supia.background.dto.PurchaseResponseDto;
import com.forest.supia.background.entity.Bgi;
import com.forest.supia.background.entity.Bgm;
import com.forest.supia.background.service.BgiService;
import com.forest.supia.background.service.BgmService;
import com.forest.supia.background.service.OwnBgiService;
import com.forest.supia.background.service.OwnBgmService;
import com.forest.supia.config.auth.JwtUtil;
import com.forest.supia.forest.service.ForestService;
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

    @Autowired
    private ForestService forestService;

    @Autowired
    private JwtUtil jwtUtil;

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

    @GetMapping("/purchase/bgm")
    public ResponseEntity<?> purchaseBgm(@RequestHeader("Authorization") String token, @RequestParam("bgmId") Long bgmId) {
        try {
            long memberId = jwtUtil.extractMemberId(token);
            PurchaseResponseDto response = ownBgmService.purchaseBgm(memberId, bgmId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/purchase/bgi")
    public ResponseEntity<?> purchaseBgi(@RequestHeader("Authorization") String token, @RequestParam("bgiId") Long bgiId) {
        try {
            long memberId = jwtUtil.extractMemberId(token);
            PurchaseResponseDto response = ownBgiService.purchaseBgi(memberId, bgiId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/own-bgm")
    public List<OwnResponseDto> getMemberOwnBgms(@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.extractMemberId(token);

        return ownBgmService.getOwnBgms(memberId);
    }

    @GetMapping("/own-bgi")
    public List<OwnResponseDto> getMemberOwnBgis(@RequestHeader("Authorization") String token) {
        long memberId = jwtUtil.extractMemberId(token);

        return ownBgiService.getOwnBgis(memberId);
    }

    @GetMapping("/check/bgm")
    public ResponseEntity<?> updateBgm(@RequestHeader("Authorization") String token, @RequestParam("bgmId") long bgmId) {
        long memberId = jwtUtil.extractMemberId(token);

        forestService.updateForestTheme(memberId, bgmId, 0);

        return ResponseEntity.ok("BGM 변경 성공");
    }

    @GetMapping("/check/bgi")
    public ResponseEntity<?> updateBgi(@RequestHeader("Authorization") String token, @RequestParam("bgmId") long bgiId) {
        long memberId = jwtUtil.extractMemberId(token);

        forestService.updateForestTheme(memberId, bgiId, 1);

        return ResponseEntity.ok("BGI 변경 성공");
    }


}
