package com.forest.supia.forest.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Forest {

    @Id @GeneratedValue
    private long id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Member member;
    private String thumbnail;


//    private Music music;
//    private Theme theme;

    @OneToMany(cascade = CascadeType.PERSIST)
    private List<ForestItem> itemForestList = new ArrayList<>();

}
