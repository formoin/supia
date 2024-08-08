package com.forest.supia.forest.entity;

import com.forest.supia.background.entity.Bgi;
import com.forest.supia.background.entity.Bgm;
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


    private String bgm;
    private String bgi;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "forest")
    private List<ForestItem> itemForestList = new ArrayList<>();

    public void setMember(Member member) {
        this.member = member;
        member.setForest(this);
    }

    public void setTheme(String bgm, String bgi) {
        this.bgm = bgm;
        this.bgi = bgi;
    }

    public static Forest createForest(Member member, String thumbnail){
        Forest forest = new Forest();

        forest.bgi = "default";
        forest.thumbnail = thumbnail;
        forest.setMember(member);

        return forest;
    }

}
