package com.recycling.controller;

import com.recycling.model.*;
import com.recycling.repository.ContainerReportRepository;
import com.recycling.repository.ContainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ContainerReportController {

    private final ContainerReportRepository reportRepository;
    private final ContainerRepository containerRepository;

    @PostMapping("/api/reports")
    public ResponseEntity<Map<String, Object>> create(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Map<String, Object> body) {
        Long containerId = Long.valueOf(body.get("containerId").toString());
        String description = body.get("description").toString().trim();
        if (description.isBlank()) throw new IllegalArgumentException("Açıklama boş olamaz.");

        Container container = containerRepository.findById(containerId)
                .orElseThrow(() -> new IllegalArgumentException("Container bulunamadı."));

        ContainerReport report = ContainerReport.builder()
                .container(container)
                .reportedBy(currentUser)
                .description(description)
                .status(ReportStatus.OPEN)
                .build();
        ContainerReport saved = reportRepository.save(report);

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "message", "Bildirim alındı. Teşekkür ederiz!"
        ));
    }

    @GetMapping("/api/reports/my")
    public ResponseEntity<List<Map<String, Object>>> myReports(@AuthenticationPrincipal User currentUser) {
        List<Map<String, Object>> result = reportRepository
                .findByReportedByOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::toMap)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/admin/reports")
    @PreAuthorize("hasAnyRole('MUNICIPALITY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> allReports(
            @RequestParam(defaultValue = "false") boolean includeResolved) {
        List<ContainerReport> reports = includeResolved
                ? reportRepository.findAll()
                : reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.OPEN);
        return ResponseEntity.ok(reports.stream().map(this::toMap).toList());
    }

    @PatchMapping("/api/admin/reports/{id}/resolve")
    @PreAuthorize("hasAnyRole('MUNICIPALITY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> resolve(@PathVariable Long id) {
        ContainerReport report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rapor bulunamadı."));
        report.setStatus(ReportStatus.RESOLVED);
        report.setResolvedAt(LocalDateTime.now());
        reportRepository.save(report);
        return ResponseEntity.ok(Map.of("message", "Rapor kapatıldı."));
    }

    private Map<String, Object> toMap(ContainerReport r) {
        return Map.of(
                "id", r.getId(),
                "containerId", r.getContainer().getId(),
                "containerName", r.getContainer().getName(),
                "description", r.getDescription(),
                "status", r.getStatus().name(),
                "createdAt", r.getCreatedAt().toString()
        );
    }
}
