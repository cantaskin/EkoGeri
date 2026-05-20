package com.recycling.service;

import com.recycling.dto.container.ContainerResponse;
import com.recycling.dto.user.UserResponse;
import com.recycling.repository.ContainerRepository;
import com.recycling.repository.UserRepository;
import com.recycling.repository.WasteDepositRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ContainerRepository containerRepository;
    private final WasteDepositRepository depositRepository;
    private final ContainerService containerService;
    private final UserService userService;

    public Map<String, Object> getOverviewStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalContainers", containerRepository.count());
        stats.put("totalDeposits", depositRepository.countTotal());
        stats.put("totalWasteKg", depositRepository.sumTotalWeightKg());
        stats.put("weeklyWasteKg", depositRepository.sumWeightKgSince(LocalDateTime.now().minusDays(7)));
        return stats;
    }

    public List<ContainerResponse> getHeatmapData() {
        return containerRepository.findAll().stream()
                .map(containerService::toResponse)
                .toList();
    }

    public List<UserResponse> getLeaderboard() {
        return userRepository.findTop10ByOrderByPointsDesc().stream()
                .map(userService::toResponse)
                .toList();
    }

    public List<Map<String, Object>> getDepositsByDate(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return depositRepository.getDepositsByDate(since).stream().map(row -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", row[0]);
            entry.put("count", row[1]);
            entry.put("totalKg", row[2]);
            return entry;
        }).toList();
    }
}
