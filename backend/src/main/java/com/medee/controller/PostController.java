package com.medee.controller;

import com.medee.dto.ApiResponse;
import com.medee.dto.CommentDto;
import com.medee.dto.CommentRequest;
import com.medee.dto.PostDto;
import com.medee.security.UserPrincipal;
import com.medee.service.CommentService;
import com.medee.service.LikeService;
import com.medee.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
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
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final LikeService likeService;
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<Page<PostDto>> getApprovedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<PostDto> posts = postService.getApprovedPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable String id) {
        PostDto post = postService.getPostById(id, true); // Increment view count
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse> toggleLike(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            HttpServletRequest request) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        String ipAddress = getClientIpAddress(request);
        ApiResponse response = likeService.toggleLike(id, userId, ipAddress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable String id) {
        List<CommentDto> comments = commentService.getCommentsByPostId(id);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        boolean isAnonymous = userId == null;
        CommentDto comment = commentService.addComment(id, userId, request, isAnonymous);
        return ResponseEntity.ok(comment);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}

