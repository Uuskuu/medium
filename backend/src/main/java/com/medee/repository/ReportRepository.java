package com.medee.repository;

import com.medee.model.Report;
import com.medee.model.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {
    
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
    
    List<Report> findByPostId(String postId);
    
    boolean existsByPostIdAndReportedBy(String postId, String reportedBy);
    
    long countByStatus(ReportStatus status);
}

