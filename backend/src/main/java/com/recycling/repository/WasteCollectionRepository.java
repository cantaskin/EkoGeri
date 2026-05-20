package com.recycling.repository;

import com.recycling.model.User;
import com.recycling.model.WasteCollection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WasteCollectionRepository extends JpaRepository<WasteCollection, Long> {
    List<WasteCollection> findByCollectedByOrderByCollectedAtDesc(User user);
}
