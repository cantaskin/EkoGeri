package com.recycling.repository;

import com.recycling.model.Container;
import com.recycling.model.ContainerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContainerRepository extends JpaRepository<Container, Long> {
    List<Container> findByStatus(ContainerStatus status);

    Optional<Container> findByQrCode(String qrCode);

    @Query(value = """
        SELECT * FROM containers
        WHERE (6371 * acos(
            cos(radians(:lat)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(:lon)) +
            sin(radians(:lat)) * sin(radians(latitude))
        )) <= :radiusKm
        ORDER BY (6371 * acos(
            cos(radians(:lat)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(:lon)) +
            sin(radians(:lat)) * sin(radians(latitude))
        ))
        """, nativeQuery = true)
    List<Container> findNearby(
        @Param("lat") double lat,
        @Param("lon") double lon,
        @Param("radiusKm") double radiusKm
    );
}
