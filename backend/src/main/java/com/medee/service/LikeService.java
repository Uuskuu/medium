package com.medee.service;

import com.medee.dto.ApiResponse;
import com.medee.model.Like;
import com.medee.model.Post;
import com.medee.repository.LikeRepository;
import com.medee.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final ReputationService reputationService;

    @Transactional
    public ApiResponse toggleLike(String postId, String userId, String ipAddress) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean isLiked;
        
        if (userId != null) {
            // Authenticated user
            if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
                likeRepository.deleteByPostIdAndUserId(postId, userId);
                post.setLikes(Math.max(0, post.getLikes() - 1));
                isLiked = false;
            } else {
                Like like = Like.builder()
                        .postId(postId)
                        .userId(userId)
                        .ipAddress(ipAddress)
                        .build();
                likeRepository.save(like);
                post.setLikes(post.getLikes() + 1);
                isLiked = true;
            }
        } else {
            // Anonymous user - use IP address
            if (likeRepository.existsByPostIdAndIpAddress(postId, ipAddress)) {
                likeRepository.deleteByPostIdAndIpAddress(postId, ipAddress);
                post.setLikes(Math.max(0, post.getLikes() - 1));
                isLiked = false;
            } else {
                Like like = Like.builder()
                        .postId(postId)
                        .userId(null)
                        .ipAddress(ipAddress)
                        .build();
                likeRepository.save(like);
                post.setLikes(post.getLikes() + 1);
                isLiked = true;
            }
        }

        postRepository.save(post);

        // Update reputation points for the post author
        reputationService.updateReputationForLike(postId, isLiked);

        return ApiResponse.builder()
                .success(true)
                .message(isLiked ? "Post liked" : "Post unliked")
                .data(post.getLikes())
                .build();
    }

    public boolean isLikedByUser(String postId, String userId, String ipAddress) {
        if (userId != null) {
            return likeRepository.existsByPostIdAndUserId(postId, userId);
        } else {
            return likeRepository.existsByPostIdAndIpAddress(postId, ipAddress);
        }
    }

    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }
}

