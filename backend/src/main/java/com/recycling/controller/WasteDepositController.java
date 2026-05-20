package com.recycling.controller;

import com.recycling.dto.deposit.DepositRequest;
import com.recycling.dto.deposit.DepositResponse;
import com.recycling.model.User;
import com.recycling.service.WasteDepositService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deposits")
@RequiredArgsConstructor
public class WasteDepositController {

    private final WasteDepositService depositService;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<DepositResponse> deposit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(depositService.deposit(user, request));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<DepositResponse>> getMyHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(depositService.getMyHistory(user));
    }
}
