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
@Document(collection = "comments")
public class Comment {
    
    @Id
    private String id;
    
    private String postId;
    
    private String userId; // nullable for anonymous
    
    private String content;
    
    private String parentCommentId; // for nested replies
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @Builder.Default
    private Boolean isAnonymous = false;
    
    @Builder.Default
    private Integer replyCount = 0;
}

