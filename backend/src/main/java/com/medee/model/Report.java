package com.medee.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {
    
    @Id
    private String id;
    
    private String postId;
    
    private String reportedBy; // User ID who reported
    
    private ReportReason reason;
    
    private String description;
    
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime reviewedAt;
    
    private String reviewedBy; // Admin ID who reviewed
    
    private String reviewNote;
}

