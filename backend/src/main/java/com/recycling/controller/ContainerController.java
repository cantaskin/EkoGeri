package com.recycling.controller;

import com.recycling.dto.container.ContainerRequest;
import com.recycling.dto.container.ContainerResponse;
import com.recycling.service.ContainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/containers")
@RequiredArgsConstructor
public class ContainerController {

    private final ContainerService containerService;

    @GetMapping
    public ResponseEntity<List<ContainerResponse>> getAll(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false, defaultValue = "5.0") Double radius) {
        return ResponseEntity.ok(containerService.getAll(lat, lon, radius));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContainerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(containerService.getById(id));
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<ContainerResponse> getByQrCode(@PathVariable String qrCode) {
        return ResponseEntity.ok(containerService.getByQrCode(qrCode));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MUNICIPALITY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ContainerResponse> create(@Valid @RequestBody ContainerRequest request) {
        return ResponseEntity.ok(containerService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MUNICIPALITY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ContainerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ContainerRequest request) {
        return ResponseEntity.ok(containerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        containerService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Container silindi."));
    }

    @PatchMapping("/{id}/fill")
    @PreAuthorize("hasAnyRole('MUNICIPALITY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ContainerResponse> updateFill(
            @PathVariable Long id,
            @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(containerService.updateFill(id, body.get("fillKg")));
    }
}
