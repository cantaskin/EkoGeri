package com.recycling.repository;

import com.recycling.model.Reward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByIsActiveTrue();
}
