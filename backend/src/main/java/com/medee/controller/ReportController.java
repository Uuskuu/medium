package com.medee.controller;

import com.medee.dto.ApiResponse;
import com.medee.dto.ReportDto;
import com.medee.dto.ReportRequest;
import com.medee.security.UserPrincipal;
import com.medee.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {
    
    private final ReportService reportService;

    @PostMapping("/{postId}/report")
    public ResponseEntity<ApiResponse<ReportDto>> reportPost(
            @PathVariable String postId,
            @Valid @RequestBody ReportRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(
                ApiResponse.error("Authentication required to report posts")
            );
        }

        ReportDto report = reportService.createReport(postId, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(report, "Report submitted successfully"));
    }
}

