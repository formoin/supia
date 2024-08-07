package com.forest.supia.forest.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Forest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne(mappedBy = "forest", fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    private String thumbnail;


//    private Music music;
//    private Theme theme;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "forest")
    private List<ForestItem> itemForestList = new ArrayList<>();

    public void setMember(Member member) {
        this.member = member;
        member.setForest(this);
    }

    public static Forest createForest(Member member, String thumbnail){
        Forest forest = new Forest();


        forest.thumbnail = thumbnail;
        forest.setMember(member);

        return forest;
    }

}
