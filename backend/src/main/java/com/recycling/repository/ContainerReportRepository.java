package com.recycling.repository;

import com.recycling.model.ContainerReport;
import com.recycling.model.ReportStatus;
import com.recycling.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContainerReportRepository extends JpaRepository<ContainerReport, Long> {
    List<ContainerReport> findByStatusOrderByCreatedAtDesc(ReportStatus status);
    List<ContainerReport> findByReportedByOrderByCreatedAtDesc(User user);
}
