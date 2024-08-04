package com.forest.supia.background.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "bgm")
public class BackgroundImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bgmId;

    private String name;
    private String path;
}
