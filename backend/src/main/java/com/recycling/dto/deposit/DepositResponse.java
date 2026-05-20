package com.recycling.dto.deposit;

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
public class DepositResponse {
    private Long id;
    private Long containerId;
    private String containerName;
    private WasteType wasteType;
    private Double weightKg;
    private Integer pointsEarned;
    private Integer totalPoints;
    private LocalDateTime depositedAt;
}
