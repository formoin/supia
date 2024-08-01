package com.forest.supia.item.entity;

import com.forest.supia.member.model.Member;
import com.forest.supia.walk.entity.Walk;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter
public class Item {
    @Id @GeneratedValue
    private Long id;

    private String si;
    private String dong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id")
    private Species species;

    private String imgUrl;
    private String originUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "walk_id")
    private Walk walk;

    private LocalDate acquireDate;
    public void setSpecies(Species species) {
        this.species = species;
        species.getItems().add(this);
    }

    public static Item createItem(Member member, Species species, LocalDate acquireDate, String si, String dong, String imgUrl, String originUrl) {
        Item item = new Item();

        item.member = member;
        item.setSpecies(species);
        item.acquireDate = acquireDate;
        item.si = si;
        item.dong = dong;
        item.imgUrl = imgUrl;
        item.originUrl = originUrl;

        return item;
    }
}
