package com.medee.controller;

import com.medee.dto.ApiResponse;
import com.medee.dto.PostDto;
import com.medee.dto.ReportDto;
import com.medee.dto.ReviewRequest;
import com.medee.dto.UserDto;
import com.medee.model.ReportStatus;
import com.medee.model.SalaryRecord;
import com.medee.model.User;
import com.medee.model.UserRole;
import com.medee.repository.UserRepository;
import com.medee.security.UserPrincipal;
import com.medee.service.PostService;
import com.medee.service.ReportService;
import com.medee.service.SalaryCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class BackofficeController {

    private final PostService postService;
    private final SalaryCalculationService salaryCalculationService;
    private final UserRepository userRepository;
    private final ReportService reportService;

    @GetMapping("/posts/pending")
    public ResponseEntity<Page<PostDto>> getPendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<PostDto> posts = postService.getPendingPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/posts/{id}/approve")
    public ResponseEntity<PostDto> approvePost(
            @PathVariable String id,
            @RequestBody(required = false) ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String note = request != null ? request.getNote() : null;
        PostDto post = postService.approvePost(id, userPrincipal.getId(), note);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/posts/{id}/reject")
    public ResponseEntity<PostDto> rejectPost(
            @PathVariable String id,
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        PostDto post = postService.rejectPost(id, userPrincipal.getId(), request.getNote());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/authors")
    public ResponseEntity<List<UserDto>> getAuthors() {
        List<User> authors = userRepository.findByRoleOrderByReputationPointsDesc(UserRole.AUTHOR);
        List<UserDto> authorDtos = authors.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(authorDtos);
    }

    @PostMapping("/salary/calculate")
    public ResponseEntity<ApiResponse> calculateSalaries(@RequestParam String month) {
        YearMonth yearMonth = YearMonth.parse(month);
        salaryCalculationService.calculateSalariesForMonth(yearMonth);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Salaries calculated for " + month)
                .build());
    }

    @GetMapping("/salary/report")
    public ResponseEntity<List<SalaryRecord>> getSalaryReport(@RequestParam String month) {
        YearMonth yearMonth = YearMonth.parse(month);
        List<SalaryRecord> records = salaryCalculationService.getSalariesForMonth(yearMonth);
        return ResponseEntity.ok(records);
    }

    // Report Management
    @GetMapping("/reports")
    public ResponseEntity<Page<ReportDto>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ReportDto> reports = reportService.getAllReports(pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/pending")
    public ResponseEntity<Page<ReportDto>> getPendingReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<ReportDto> reports = reportService.getPendingReports(pageable);
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/reports/{id}/review")
    public ResponseEntity<ApiResponse<ReportDto>> reviewReport(
            @PathVariable String id,
            @RequestParam ReportStatus status,
            @RequestBody(required = false) ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String note = request != null ? request.getNote() : null;
        ReportDto report = reportService.reviewReport(id, userPrincipal.getId(), status, note);
        return ResponseEntity.ok(ApiResponse.success(report, "Report reviewed successfully"));
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .reputationPoints(user.getReputationPoints())
                .displayName(user.getProfile() != null ? user.getProfile().getDisplayName() : user.getUsername())
                .bio(user.getProfile() != null ? user.getProfile().getBio() : null)
                .avatar(user.getProfile() != null ? user.getProfile().getAvatar() : null)
                .build();
    }
}

