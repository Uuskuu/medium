package com.medee.repository;

import com.medee.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
    List<Comment> findByPostIdAndParentCommentIdIsNullOrderByCreatedAtDesc(String postId);
    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(String parentCommentId);
    long countByPostId(String postId);
    long countByUserId(String userId);
    long countByParentCommentId(String parentCommentId);
}

