package com.recycling.controller;

import com.recycling.model.*;
import com.recycling.repository.ContainerRepository;
import com.recycling.repository.WasteCollectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class WasteCollectionController {

    private final WasteCollectionRepository collectionRepository;
    private final ContainerRepository containerRepository;

    @PostMapping("/collect")
    @PreAuthorize("hasRole('MUNICIPALITY_ADMIN')")
    @Transactional
    public ResponseEntity<Map<String, Object>> collect(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Map<String, String> body) {
        String qrCode = body.get("qrCode");
        if (qrCode == null || qrCode.isBlank()) throw new IllegalArgumentException("QR kod gerekli.");

        Container container = containerRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new IllegalArgumentException("Geçersiz QR kod."));

        double collected = container.getCurrentFillKg();
        container.setCurrentFillKg(0.0);
        if (container.getStatus() == ContainerStatus.FULL) {
            container.setStatus(ContainerStatus.ACTIVE);
        }
        containerRepository.save(container);

        WasteCollection collection = WasteCollection.builder()
                .container(container)
                .collectedBy(currentUser)
                .collectedWeightKg(collected)
                .build();
        WasteCollection saved = collectionRepository.save(collection);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "containerName", container.getName(),
                "collectedWeightKg", collected,
                "collectedAt", saved.getCollectedAt().toString()
        ));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('MUNICIPALITY_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> myCollections(@AuthenticationPrincipal User currentUser) {
        List<Map<String, Object>> result = collectionRepository
                .findByCollectedByOrderByCollectedAtDesc(currentUser)
                .stream()
                .map(c -> Map.<String, Object>of(
                        "id", c.getId(),
                        "containerId", c.getContainer().getId(),
                        "containerName", c.getContainer().getName(),
                        "collectedWeightKg", c.getCollectedWeightKg(),
                        "collectedAt", c.getCollectedAt().toString()
                ))
                .toList();
        return ResponseEntity.ok(result);
    }
}
