package com.recycling.dto.container;

import com.recycling.model.ContainerStatus;
import com.recycling.model.WasteType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContainerRequest {
    @NotBlank
    private String name;
    private String address;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    @NotNull
    private Double capacityKg;
    @NotNull
    private WasteType wasteType;
    private ContainerStatus status = ContainerStatus.ACTIVE;
}
