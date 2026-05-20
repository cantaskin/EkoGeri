package com.recycling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rewards")
public class Reward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "points_cost", nullable = false)
    private Integer pointsCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RewardCategory category;

    @Column(nullable = false)
    private Integer stock = -1;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
