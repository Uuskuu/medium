package com.medee.service;

import com.medee.dto.PostDto;
import com.medee.dto.PostRequest;
import com.medee.model.Post;
import com.medee.model.PostStatus;
import com.medee.model.User;
import com.medee.repository.PostRepository;
import com.medee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostDto createPost(String authorId, PostRequest request) {
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .authorId(authorId)
                .status(PostStatus.DRAFT)
                .likes(0)
                .views(0)
                .build();

        post = postRepository.save(post);
        return mapToDto(post);
    }

    public PostDto updatePost(String postId, String authorId, PostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to update this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post = postRepository.save(post);

        return mapToDto(post);
    }

    public void deletePost(String postId, String authorId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    public PostDto submitForReview(String postId, String authorId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to submit this post");
        }

        if (post.getStatus() != PostStatus.DRAFT && post.getStatus() != PostStatus.REJECTED) {
            throw new RuntimeException("Only draft or rejected posts can be submitted for review");
        }

        post.setStatus(PostStatus.PENDING_REVIEW);
        post = postRepository.save(post);

        return mapToDto(post);
    }

    public Page<PostDto> getMyPosts(String authorId, Pageable pageable) {
        Page<Post> posts = postRepository.findByAuthorId(authorId, pageable);
        return posts.map(this::mapToDto);
    }

    public List<PostDto> getMyPostsByStatus(String authorId, PostStatus status) {
        List<Post> posts = postRepository.findByAuthorIdAndStatus(authorId, status);
        return posts.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Page<PostDto> getApprovedPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findByStatus(PostStatus.APPROVED, pageable);
        return posts.map(this::mapToDto);
    }

    public PostDto getPostById(String postId, boolean incrementView) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (incrementView) {
            post.setViews(post.getViews() + 1);
            postRepository.save(post);
        }

        return mapToDto(post);
    }

    public PostDto approvePost(String postId, String adminId, String note) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getStatus() != PostStatus.PENDING_REVIEW) {
            throw new RuntimeException("Only pending posts can be approved");
        }

        post.setStatus(PostStatus.APPROVED);
        post.setReviewedBy(adminId);
        post.setReviewNote(note);
        post.setPublishedAt(LocalDateTime.now());
        post = postRepository.save(post);

        return mapToDto(post);
    }

    public PostDto rejectPost(String postId, String adminId, String note) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getStatus() != PostStatus.PENDING_REVIEW) {
            throw new RuntimeException("Only pending posts can be rejected");
        }

        post.setStatus(PostStatus.REJECTED);
        post.setReviewedBy(adminId);
        post.setReviewNote(note);
        post = postRepository.save(post);

        return mapToDto(post);
    }

    public Page<PostDto> getPendingPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findByStatus(PostStatus.PENDING_REVIEW, pageable);
        return posts.map(this::mapToDto);
    }

    private PostDto mapToDto(Post post) {
        User author = userRepository.findById(post.getAuthorId()).orElse(null);
        String authorName = author != null && author.getProfile() != null 
                ? author.getProfile().getDisplayName() 
                : (author != null ? author.getUsername() : "Unknown");

        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorId(post.getAuthorId())
                .authorName(authorName)
                .status(post.getStatus())
                .likes(post.getLikes())
                .views(post.getViews())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .publishedAt(post.getPublishedAt())
                .reviewNote(post.getReviewNote())
                .build();
    }
}

