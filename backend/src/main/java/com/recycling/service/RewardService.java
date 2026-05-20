package com.recycling.service;

import com.recycling.dto.reward.RewardRequest;
import com.recycling.model.Redemption;
import com.recycling.model.Reward;
import com.recycling.model.User;
import com.recycling.repository.RedemptionRepository;
import com.recycling.repository.RewardRepository;
import com.recycling.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final RedemptionRepository redemptionRepository;
    private final UserRepository userRepository;

    public List<Reward> getActiveRewards() {
        return rewardRepository.findByIsActiveTrue();
    }

    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }

    public Reward create(RewardRequest request) {
        Reward reward = Reward.builder()
                .name(request.getName())
                .description(request.getDescription())
                .pointsCost(request.getPointsCost())
                .category(request.getCategory())
                .stock(request.getStock() != null ? request.getStock() : -1)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return rewardRepository.save(reward);
    }

    public Reward update(Long id, RewardRequest request) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ödül bulunamadı."));
        reward.setName(request.getName());
        reward.setDescription(request.getDescription());
        reward.setPointsCost(request.getPointsCost());
        reward.setCategory(request.getCategory());
        if (request.getStock() != null) reward.setStock(request.getStock());
        if (request.getIsActive() != null) reward.setIsActive(request.getIsActive());
        return rewardRepository.save(reward);
    }

    @Transactional
    public Redemption redeem(User currentUser, Long rewardId) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new IllegalArgumentException("Ödül bulunamadı."));

        if (!reward.getIsActive()) {
            throw new IllegalStateException("Bu ödül artık aktif değil.");
        }
        if (currentUser.getPoints() < reward.getPointsCost()) {
            throw new IllegalStateException("Yeterli puanınız yok.");
        }
        if (reward.getStock() == 0) {
            throw new IllegalStateException("Bu ödülün stoğu tükendi.");
        }

        currentUser.setPoints(currentUser.getPoints() - reward.getPointsCost());
        userRepository.save(currentUser);

        if (reward.getStock() > 0) {
            reward.setStock(reward.getStock() - 1);
            rewardRepository.save(reward);
        }

        Redemption redemption = Redemption.builder()
                .user(currentUser)
                .reward(reward)
                .pointsSpent(reward.getPointsCost())
                .status("COMPLETED")
                .build();
        return redemptionRepository.save(redemption);
    }

    public List<Redemption> getMyRedemptions(User currentUser) {
        return redemptionRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }
}
