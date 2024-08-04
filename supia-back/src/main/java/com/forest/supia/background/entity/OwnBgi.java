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
@Table(name = "own_bgi")
public class OwnBgi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "bgi_id")
    private Bgi bgi;

    public OwnBgi(Member member, Bgi bgi) {
        this.member = member;
        this.bgi = bgi;
    }
}