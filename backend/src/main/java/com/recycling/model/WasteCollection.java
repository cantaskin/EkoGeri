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
@Table(name = "waste_collections")
public class WasteCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "container_id", nullable = false)
    private Container container;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collected_by", nullable = false)
    private User collectedBy;

    @Column(name = "collected_weight_kg", nullable = false)
    private Double collectedWeightKg;

    @Column(name = "collected_at", nullable = false, updatable = false)
    private LocalDateTime collectedAt;

    @PrePersist
    protected void onCreate() {
        collectedAt = LocalDateTime.now();
    }
}
