package com.medee.service;

import com.medee.dto.CommentDto;
import com.medee.dto.CommentRequest;
import com.medee.model.Comment;
import com.medee.model.User;
import com.medee.repository.CommentRepository;
import com.medee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ReputationService reputationService;

    public CommentDto addComment(String postId, String userId, CommentRequest request, boolean isAnonymous) {
        Comment comment = Comment.builder()
                .postId(postId)
                .userId(isAnonymous ? null : userId)
                .content(request.getContent())
                .parentCommentId(request.getParentCommentId())
                .isAnonymous(isAnonymous)
                .replyCount(0)
                .build();

        comment = commentRepository.save(comment);

        // Update parent comment reply count if this is a reply
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId()).orElse(null);
            if (parentComment != null) {
                parentComment.setReplyCount(parentComment.getReplyCount() + 1);
                commentRepository.save(parentComment);
            }
        }

        // Update reputation points for the post author
        if (!isAnonymous) {
            reputationService.updateReputationForComment(postId);
        }

        return mapToDto(comment);
    }

    public List<CommentDto> getCommentsByPostId(String postId) {
        // Get only top-level comments (no parent)
        List<Comment> topLevelComments = commentRepository.findByPostIdAndParentCommentIdIsNullOrderByCreatedAtDesc(postId);
        return topLevelComments.stream().map(this::mapToDtoWithReplies).collect(Collectors.toList());
    }
    
    public List<CommentDto> getRepliesByCommentId(String commentId) {
        List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(commentId);
        return replies.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentDto mapToDto(Comment comment) {
        String username = "Anonymous";
        if (!comment.getIsAnonymous() && comment.getUserId() != null) {
            User user = userRepository.findById(comment.getUserId()).orElse(null);
            if (user != null) {
                username = user.getProfile() != null ? user.getProfile().getDisplayName() : user.getUsername();
            }
        }

        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .username(username)
                .content(comment.getContent())
                .parentCommentId(comment.getParentCommentId())
                .createdAt(comment.getCreatedAt())
                .isAnonymous(comment.getIsAnonymous())
                .replyCount(comment.getReplyCount())
                .build();
    }
    
    private CommentDto mapToDtoWithReplies(Comment comment) {
        CommentDto dto = mapToDto(comment);
        // Optionally load first few replies
        List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.getId());
        dto.setReplies(replies.stream().map(this::mapToDto).collect(Collectors.toList()));
        return dto;
    }
}

