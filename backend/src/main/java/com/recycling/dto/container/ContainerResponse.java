package com.recycling.dto.container;

import com.recycling.model.ContainerStatus;
import com.recycling.model.WasteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContainerResponse {
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double capacityKg;
    private Double currentFillKg;
    private Double fillPercentage;
    private WasteType wasteType;
    private ContainerStatus status;
    private String qrCode;
    private LocalDateTime createdAt;
}
