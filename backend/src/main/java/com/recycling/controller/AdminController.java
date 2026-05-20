package com.recycling.controller;

import com.recycling.dto.container.ContainerResponse;
import com.recycling.dto.user.UserResponse;
import com.recycling.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats/overview")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(adminService.getOverviewStats());
    }

    @GetMapping("/containers/heatmap")
    @PreAuthorize("hasAnyRole('MUNICIPALITY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<ContainerResponse>> getHeatmap() {
        return ResponseEntity.ok(adminService.getHeatmapData());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserResponse>> getLeaderboard() {
        return ResponseEntity.ok(adminService.getLeaderboard());
    }

    @GetMapping("/reports/deposits-by-date")
    @PreAuthorize("hasAnyRole('MUNICIPALITY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getDepositsByDate(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(adminService.getDepositsByDate(days));
    }
}
