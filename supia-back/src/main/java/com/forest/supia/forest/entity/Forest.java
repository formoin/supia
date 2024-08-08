package com.forest.supia.forest.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString
@Table(name = "Forest")
public class Forest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "forest", fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false, columnDefinition = "VARCHAR(500)")
    private String thumbnail;

    public void setDefaultThumbnail(String defaultThumbnail) {
        this.thumbnail = defaultThumbnail;
    }

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

    public static Forest createForest(Member member, String thumbnail, String bgi) {
        Forest forest = new Forest();
        forest.thumbnail = thumbnail;
        forest.member = member;
        forest.bgi = bgi;
        return forest;
    }

}
