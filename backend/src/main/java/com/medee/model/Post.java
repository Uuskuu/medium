package com.medee.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    
    @Id
    private String id;
    
    private String title;
    
    // Draft.js raw content stored as JSON string
    private String content;
    
    private String authorId;
    
    @Builder.Default
    private PostStatus status = PostStatus.DRAFT;
    
    @Builder.Default
    private Integer likes = 0;
    
    @Builder.Default
    private Integer views = 0;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime publishedAt;
    
    private String reviewedBy;
    
    private String reviewNote;
}

