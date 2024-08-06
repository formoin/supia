package com.forest.supia.background.entity;

import com.forest.supia.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "purchase_history")
public class PurchaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private int themeType;
    private LocalDateTime purchaseDate;

    private Long themeId;

    public PurchaseHistory(Member member, int themeType, LocalDateTime purchaseDate, Long themeId) {
        this.member = member;
        this.themeType = themeType;
        this.purchaseDate = purchaseDate;
        this.themeId = themeId;
    }

}