package com.medee.service;

import com.medee.dto.ReportDto;
import com.medee.dto.ReportRequest;
import com.medee.model.Post;
import com.medee.model.Report;
import com.medee.model.ReportStatus;
import com.medee.model.User;
import com.medee.repository.PostRepository;
import com.medee.repository.ReportRepository;
import com.medee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReportDto createReport(String postId, String userId, ReportRequest request) {
        // Check if user already reported this post
        if (reportRepository.existsByPostIdAndReportedBy(postId, userId)) {
            throw new RuntimeException("You have already reported this post");
        }

        // Verify post exists
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }

        Report report = Report.builder()
                .postId(postId)
                .reportedBy(userId)
                .reason(request.getReason())
                .description(request.getDescription())
                .status(ReportStatus.PENDING)
                .build();

        report = reportRepository.save(report);
        return mapToDto(report);
    }

    public Page<ReportDto> getPendingReports(Pageable pageable) {
        Page<Report> reports = reportRepository.findByStatus(ReportStatus.PENDING, pageable);
        return reports.map(this::mapToDto);
    }

    public Page<ReportDto> getAllReports(Pageable pageable) {
        Page<Report> reports = reportRepository.findAll(pageable);
        return reports.map(this::mapToDto);
    }

    public ReportDto getReportById(String id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return mapToDto(report);
    }

    @Transactional
    public ReportDto reviewReport(String reportId, String adminId, ReportStatus newStatus, String note) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(newStatus);
        report.setReviewedBy(adminId);
        report.setReviewedAt(LocalDateTime.now());
        report.setReviewNote(note);

        report = reportRepository.save(report);
        return mapToDto(report);
    }

    private ReportDto mapToDto(Report report) {
        String postTitle = "Unknown";
        if (report.getPostId() != null) {
            Post post = postRepository.findById(report.getPostId()).orElse(null);
            if (post != null) {
                postTitle = post.getTitle();
            }
        }

        String reportedByUsername = "Unknown";
        if (report.getReportedBy() != null) {
            User user = userRepository.findById(report.getReportedBy()).orElse(null);
            if (user != null) {
                reportedByUsername = user.getProfile() != null ? 
                    user.getProfile().getDisplayName() : user.getUsername();
            }
        }

        return ReportDto.builder()
                .id(report.getId())
                .postId(report.getPostId())
                .postTitle(postTitle)
                .reportedBy(report.getReportedBy())
                .reportedByUsername(reportedByUsername)
                .reason(report.getReason())
                .description(report.getDescription())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .reviewedAt(report.getReviewedAt())
                .reviewedBy(report.getReviewedBy())
                .reviewNote(report.getReviewNote())
                .build();
    }
}

