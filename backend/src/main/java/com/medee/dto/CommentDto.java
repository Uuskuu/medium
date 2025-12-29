package com.medee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private String id;
    private String postId;
    private String userId;
    private String username;
    private String content;
    private String parentCommentId;
    private LocalDateTime createdAt;
    private Boolean isAnonymous;
    private Integer replyCount;
    private List<CommentDto> replies;
}

