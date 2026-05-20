package com.recycling.service;

import com.recycling.dto.deposit.DepositRequest;
import com.recycling.dto.deposit.DepositResponse;
import com.recycling.model.Container;
import com.recycling.model.User;
import com.recycling.model.WasteDeposit;
import com.recycling.repository.UserRepository;
import com.recycling.repository.WasteDepositRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WasteDepositService {

    private final WasteDepositRepository depositRepository;
    private final ContainerService containerService;
    private final UserRepository userRepository;

    @Transactional
    public DepositResponse deposit(User currentUser, DepositRequest request) {
        Container container = containerService.findOrThrow(request.getContainerId());

        int points = (int) (request.getWeightKg() * request.getWasteType().getPointsPerKg());

        WasteDeposit deposit = WasteDeposit.builder()
                .user(currentUser)
                .container(container)
                .wasteType(request.getWasteType())
                .estimatedWeightKg(request.getWeightKg())
                .pointsEarned(points)
                .build();
        depositRepository.save(deposit);

        // Kullanıcı puanlarını ve toplam kg'ını güncelle
        currentUser.setPoints(currentUser.getPoints() + points);
        currentUser.setTotalWasteKg(currentUser.getTotalWasteKg() + request.getWeightKg());
        userRepository.save(currentUser);

        // Container doluluk güncelle
        containerService.updateFill(container.getId(), container.getCurrentFillKg() + request.getWeightKg());

        return DepositResponse.builder()
                .id(deposit.getId())
                .containerId(container.getId())
                .containerName(container.getName())
                .wasteType(request.getWasteType())
                .weightKg(request.getWeightKg())
                .pointsEarned(points)
                .totalPoints(currentUser.getPoints())
                .depositedAt(deposit.getDepositedAt())
                .build();
    }

    public List<DepositResponse> getMyHistory(User currentUser) {
        return depositRepository.findByUserIdOrderByDepositedAtDesc(currentUser.getId())
                .stream().map(d -> DepositResponse.builder()
                        .id(d.getId())
                        .containerId(d.getContainer().getId())
                        .containerName(d.getContainer().getName())
                        .wasteType(d.getWasteType())
                        .weightKg(d.getEstimatedWeightKg())
                        .pointsEarned(d.getPointsEarned())
                        .depositedAt(d.getDepositedAt())
                        .build())
                .toList();
    }
}
