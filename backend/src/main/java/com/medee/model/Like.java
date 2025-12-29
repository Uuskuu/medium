package com.medee.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "likes")
@CompoundIndex(name = "post_user_idx", def = "{'postId': 1, 'userId': 1}")
@CompoundIndex(name = "post_ip_idx", def = "{'postId': 1, 'ipAddress': 1}")
public class Like {
    
    @Id
    private String id;
    
    private String postId;
    
    private String userId; // nullable for anonymous
    
    private String ipAddress; // for anonymous tracking
    
    @CreatedDate
    private LocalDateTime createdAt;
}

