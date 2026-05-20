package com.recycling.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "containers")
public class Container {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "capacity_kg", nullable = false)
    private Double capacityKg;

    @Column(name = "current_fill_kg", nullable = false)
    private Double currentFillKg = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_type", nullable = false)
    private WasteType wasteType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContainerStatus status = ContainerStatus.ACTIVE;

    @Column(name = "qr_code", unique = true, nullable = false)
    private String qrCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (qrCode == null) qrCode = UUID.randomUUID().toString();
    }

    public double getFillPercentage() {
        if (capacityKg == null || capacityKg == 0) return 0;
        return (currentFillKg / capacityKg) * 100.0;
    }
}
