package com.recycling.service;

import com.recycling.dto.container.ContainerRequest;
import com.recycling.dto.container.ContainerResponse;
import com.recycling.model.Container;
import com.recycling.model.ContainerStatus;
import com.recycling.repository.ContainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContainerService {

    private final ContainerRepository containerRepository;

    public List<ContainerResponse> getAll(Double lat, Double lon, Double radiusKm) {
        List<Container> containers;
        if (lat != null && lon != null && radiusKm != null) {
            containers = containerRepository.findNearby(lat, lon, radiusKm);
        } else {
            containers = containerRepository.findAll();
        }
        return containers.stream().map(this::toResponse).toList();
    }

    public ContainerResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public ContainerResponse getByQrCode(String qrCode) {
        Container c = containerRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new IllegalArgumentException("Geçersiz QR kod."));
        return toResponse(c);
    }

    public ContainerResponse create(ContainerRequest request) {
        Container container = Container.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .capacityKg(request.getCapacityKg())
                .currentFillKg(0.0)
                .wasteType(request.getWasteType())
                .status(request.getStatus() != null ? request.getStatus() : ContainerStatus.ACTIVE)
                .build();
        return toResponse(containerRepository.save(container));
    }

    public ContainerResponse update(Long id, ContainerRequest request) {
        Container container = findOrThrow(id);
        container.setName(request.getName());
        container.setAddress(request.getAddress());
        container.setLatitude(request.getLatitude());
        container.setLongitude(request.getLongitude());
        container.setCapacityKg(request.getCapacityKg());
        container.setWasteType(request.getWasteType());
        if (request.getStatus() != null) container.setStatus(request.getStatus());
        return toResponse(containerRepository.save(container));
    }

    public void delete(Long id) {
        containerRepository.deleteById(id);
    }

    public ContainerResponse updateFill(Long id, Double fillKg) {
        Container container = findOrThrow(id);
        container.setCurrentFillKg(fillKg);
        if (fillKg >= container.getCapacityKg()) {
            container.setStatus(ContainerStatus.FULL);
        } else if (container.getStatus() == ContainerStatus.FULL) {
            container.setStatus(ContainerStatus.ACTIVE);
        }
        return toResponse(containerRepository.save(container));
    }

    public Container findOrThrow(Long id) {
        return containerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Container bulunamadı: " + id));
    }

    public ContainerResponse toResponse(Container c) {
        return ContainerResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .address(c.getAddress())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .capacityKg(c.getCapacityKg())
                .currentFillKg(c.getCurrentFillKg())
                .fillPercentage(c.getFillPercentage())
                .wasteType(c.getWasteType())
                .status(c.getStatus())
                .qrCode(c.getQrCode())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
