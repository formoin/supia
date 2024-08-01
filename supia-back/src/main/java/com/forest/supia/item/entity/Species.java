package com.forest.supia.item.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Species {

    @Id @GeneratedValue
    private long id;


    @OneToMany
    private List<Item> items = new ArrayList<>();

    private String name;
    private String category;
    private String sound;
    private String description;
    private String representativeImg;



}
