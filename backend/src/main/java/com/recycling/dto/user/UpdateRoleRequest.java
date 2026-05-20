package com.recycling.dto.user;

import com.recycling.model.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRoleRequest {
    @NotNull
    private Role role;
}
