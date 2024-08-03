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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forest_id")
    private Forest forest;
    private double x;
    private double y;

    private boolean soundOn;

    public static ForestItem createForestItem(Item item, Forest forest, double x, double y, boolean soundOn) {
        ForestItem forestItem = new ForestItem();

        forestItem.item = item;
        forestItem.forest = forest;
        forestItem.x = x;
        forestItem.y = y;
        forestItem.soundOn = soundOn;

        return forestItem;
    }

}
