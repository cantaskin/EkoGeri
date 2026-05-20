package com.recycling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "waste_deposits")
public class WasteDeposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "container_id", nullable = false)
    private Container container;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_type", nullable = false)
    private WasteType wasteType;

    @Column(name = "estimated_weight_kg", nullable = false)
    private Double estimatedWeightKg;

    @Column(name = "points_earned", nullable = false)
    private Integer pointsEarned;

    @Column(name = "deposited_at", nullable = false, updatable = false)
    private LocalDateTime depositedAt;

    @PrePersist
    protected void onCreate() {
        depositedAt = LocalDateTime.now();
    }
}
