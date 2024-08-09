package com.forest.supia.forest.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Forest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(columnDefinition = "VARCHAR(500)")
    private String thumbnail;

    @Column(columnDefinition = "VARCHAR(500)")
    private String bgm;

    @Column(nullable = false, columnDefinition = "VARCHAR(500)")
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

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public static Forest createForest(Member member, String thumbnail, String bgi) {
        Forest forest = new Forest();
        forest.thumbnail = thumbnail;
        forest.bgi = bgi;
        forest.setMember(member);

        return forest;
    }

}
