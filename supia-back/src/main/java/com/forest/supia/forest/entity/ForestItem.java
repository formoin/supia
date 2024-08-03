package com.forest.supia.forest.entity;

import com.forest.supia.forest.dto.ForestItemRequest;
import com.forest.supia.item.entity.Item;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@DynamicUpdate
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    public void update(ForestItemRequest forestItemRequest) {

        this.x = forestItemRequest.getX();
        this.y = forestItemRequest.getY();
        this.soundOn = forestItemRequest.isSoundOn();

    }

}
