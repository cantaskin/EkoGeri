package com.recycling.repository;

import com.recycling.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u ORDER BY u.points DESC LIMIT 10")
    List<User> findTop10ByOrderByPointsDesc();
}
