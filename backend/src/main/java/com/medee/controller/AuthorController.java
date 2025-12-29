package com.medee.controller;

import com.medee.dto.ApiResponse;
import com.medee.dto.PostDto;
import com.medee.dto.PostRequest;
import com.medee.model.PostStatus;
import com.medee.security.UserPrincipal;
import com.medee.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/author/posts")
@RequiredArgsConstructor
public class AuthorController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        PostDto post = postService.createPost(userPrincipal.getId(), request);
        return ResponseEntity.ok(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable String id,
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        PostDto post = postService.updatePost(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePost(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        postService.deletePost(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Post deleted successfully")
                .build());
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<PostDto> submitForReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        PostDto post = postService.submitForReview(id, userPrincipal.getId());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<PostDto>> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PostDto> posts = postService.getMyPosts(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/my/status/{status}")
    public ResponseEntity<List<PostDto>> getMyPostsByStatus(
            @PathVariable String status,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        PostStatus postStatus = PostStatus.valueOf(status.toUpperCase());
        List<PostDto> posts = postService.getMyPostsByStatus(userPrincipal.getId(), postStatus);
        return ResponseEntity.ok(posts);
    }
}

