package com.recycling.dto.deposit;

import com.recycling.model.WasteType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DepositRequest {
    @NotNull
    private Long containerId;
    @NotNull
    private WasteType wasteType;
    @NotNull @DecimalMin("0.1")
    private Double weightKg;
}
