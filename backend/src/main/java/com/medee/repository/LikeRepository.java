package com.medee.repository;

import com.medee.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    long countByPostId(String postId);
    Optional<Like> findByPostIdAndUserId(String postId, String userId);
    Optional<Like> findByPostIdAndIpAddress(String postId, String ipAddress);
    boolean existsByPostIdAndUserId(String postId, String userId);
    boolean existsByPostIdAndIpAddress(String postId, String ipAddress);
    void deleteByPostIdAndUserId(String postId, String userId);
    void deleteByPostIdAndIpAddress(String postId, String ipAddress);
}

