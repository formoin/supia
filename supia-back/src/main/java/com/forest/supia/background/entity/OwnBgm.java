package com.forest.supia.background.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "own_bgm")
public class OwnBgm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "bgm_id")
    private Bgm bgm;

    public OwnBgm(Member member, Bgm bgm) {
        this.member = member;
        this.bgm = bgm;
    }


}
