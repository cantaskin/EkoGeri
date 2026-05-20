package com.recycling.repository;

import com.recycling.model.WasteDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface WasteDepositRepository extends JpaRepository<WasteDeposit, Long> {
    List<WasteDeposit> findByUserIdOrderByDepositedAtDesc(Long userId);

    @Query("SELECT COUNT(d) FROM WasteDeposit d")
    long countTotal();

    @Query("SELECT COALESCE(SUM(d.estimatedWeightKg), 0) FROM WasteDeposit d")
    double sumTotalWeightKg();

    @Query("SELECT COALESCE(SUM(d.estimatedWeightKg), 0) FROM WasteDeposit d WHERE d.depositedAt >= :since")
    double sumWeightKgSince(@Param("since") LocalDateTime since);

    @Query(value = """
        SELECT TO_CHAR(deposited_at, 'YYYY-MM-DD') as date, COUNT(*) as count, SUM(estimated_weight_kg) as total_kg
        FROM waste_deposits
        WHERE deposited_at >= :since
        GROUP BY TO_CHAR(deposited_at, 'YYYY-MM-DD')
        ORDER BY date
        """, nativeQuery = true)
    List<Object[]> getDepositsByDate(@Param("since") LocalDateTime since);
}
