package com.recycling.repository;

import com.recycling.model.Redemption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RedemptionRepository extends JpaRepository<Redemption, Long> {
    List<Redemption> findByUserIdOrderByCreatedAtDesc(Long userId);
}
