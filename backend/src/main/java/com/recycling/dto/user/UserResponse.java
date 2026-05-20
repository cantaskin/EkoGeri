package com.recycling.dto.user;

import com.recycling.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private Integer points;
    private Double totalWasteKg;
    private LocalDateTime createdAt;
}
