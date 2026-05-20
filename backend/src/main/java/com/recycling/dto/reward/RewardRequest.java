package com.recycling.dto.reward;

import com.recycling.model.RewardCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RewardRequest {
    @NotBlank
    private String name;
    private String description;
    @NotNull @Min(1)
    private Integer pointsCost;
    @NotNull
    private RewardCategory category;
    private Integer stock = -1;
    private Boolean isActive = true;
}
