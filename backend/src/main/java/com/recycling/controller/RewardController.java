package com.recycling.controller;

import com.recycling.dto.reward.RewardRequest;
import com.recycling.model.Redemption;
import com.recycling.model.Reward;
import com.recycling.model.User;
import com.recycling.service.RewardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<List<Reward>> getRewards(@AuthenticationPrincipal User user) {
        if (user != null && (user.getRole().name().equals("SUPER_ADMIN"))) {
            return ResponseEntity.ok(rewardService.getAllRewards());
        }
        return ResponseEntity.ok(rewardService.getActiveRewards());
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Reward> create(@Valid @RequestBody RewardRequest request) {
        return ResponseEntity.ok(rewardService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Reward> update(@PathVariable Long id, @Valid @RequestBody RewardRequest request) {
        return ResponseEntity.ok(rewardService.update(id, request));
    }

    @PostMapping("/{id}/redeem")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Redemption> redeem(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(rewardService.redeem(user, id));
    }

    @GetMapping("/redemptions/my-history")
    public ResponseEntity<List<Redemption>> getMyRedemptions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rewardService.getMyRedemptions(user));
    }
}
