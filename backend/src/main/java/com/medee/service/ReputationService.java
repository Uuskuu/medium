package com.medee.service;

import com.medee.model.Post;
import com.medee.model.User;
import com.medee.repository.CommentRepository;
import com.medee.repository.PostRepository;
import com.medee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReputationService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    private static final int POINTS_PER_LIKE = 10;
    private static final int POINTS_PER_VIEW = 1;
    private static final int POINTS_PER_COMMENT = 5;

    public void updateReputationForLike(String postId, boolean isLiked) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) return;

        User author = userRepository.findById(post.getAuthorId()).orElse(null);
        if (author == null) return;

        int change = isLiked ? POINTS_PER_LIKE : -POINTS_PER_LIKE;
        author.setReputationPoints(Math.max(0, author.getReputationPoints() + change));
        userRepository.save(author);
    }

    public void updateReputationForComment(String postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) return;

        User author = userRepository.findById(post.getAuthorId()).orElse(null);
        if (author == null) return;

        author.setReputationPoints(author.getReputationPoints() + POINTS_PER_COMMENT);
        userRepository.save(author);
    }

    public void updateReputationForView(String postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) return;

        User author = userRepository.findById(post.getAuthorId()).orElse(null);
        if (author == null) return;

        author.setReputationPoints(author.getReputationPoints() + POINTS_PER_VIEW);
        userRepository.save(author);
    }

    public int calculateReputationPoints(int likes, int views, int comments) {
        return (likes * POINTS_PER_LIKE) + (views * POINTS_PER_VIEW) + (comments * POINTS_PER_COMMENT);
    }
}

