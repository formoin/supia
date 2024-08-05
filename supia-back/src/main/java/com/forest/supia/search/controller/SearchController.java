package com.forest.supia.search.controller;

import com.forest.supia.forest.dto.ForestResponse;
import com.forest.supia.member.dto.MemberResponse;
import com.forest.supia.member.entity.Member;
import com.forest.supia.search.dto.ItemSearchResponse;
import com.forest.supia.search.dto.MemberSearchResponse;
import com.forest.supia.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/search")
public class SearchController {

    private final SearchService searchService;
    @GetMapping
    public ResponseEntity<?> search(@RequestParam("type") int type, @RequestParam("keyword") String keyword)  throws Exception {

        if(type ==0) {
            List<MemberSearchResponse> memberSearchResponseList = searchService.searchMember(keyword);
            if(memberSearchResponseList.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("검색 결과가 없습니다.");
            else return ResponseEntity.ok(memberSearchResponseList);
        }
        else if(type ==1)  {
            List<ItemSearchResponse> itemSearchResponseList = searchService.searchItem(keyword);
            if(itemSearchResponseList.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("검색 결과가 없습니다.");
            else return ResponseEntity.ok(itemSearchResponseList);
        }
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 입력입니다.");
        }
    }

    @GetMapping("/member")
    public ResponseEntity<?> searchMember(@RequestParam("memberId") long memberId, @RequestParam("findId") long findId) throws Exception {

        MemberResponse memberResponse = searchService.memberDetail(memberId, findId);
        if(memberResponse == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("검색 결과가 없습니다.");
        else return ResponseEntity.ok(memberResponse);

    }

}
