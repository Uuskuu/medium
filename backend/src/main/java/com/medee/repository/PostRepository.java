package com.medee.repository;

import com.medee.model.Post;
import com.medee.model.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findByStatus(PostStatus status, Pageable pageable);
    List<Post> findByAuthorIdAndStatus(String authorId, PostStatus status);
    List<Post> findByAuthorId(String authorId);
    Page<Post> findByAuthorId(String authorId, Pageable pageable);
    long countByStatus(PostStatus status);
    long countByAuthorId(String authorId);
    
    // Category related methods
    long countByCategoryId(String categoryId);
    Page<Post> findByCategoryIdAndStatus(String categoryId, PostStatus status, Pageable pageable);
    List<Post> findByCategoryId(String categoryId);
}

