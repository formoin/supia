package com.forest.supia.forest.entity;

import com.forest.supia.item.entity.Item;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class ForestItem {
    @Id @GeneratedValue
    private long id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Item item;

    private double x;
    private double y;

    private boolean soundOn;

}
