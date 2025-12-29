package com.medee.dto;

import com.medee.model.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private String id;
    private String title;
    private String content;
    private String authorId;
    private String authorName;
    private String categoryId;
    private String categoryName;
    private PostStatus status;
    private Integer likes;
    private Integer views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    private String reviewNote;
}

