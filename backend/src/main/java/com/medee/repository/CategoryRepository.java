package com.medee.repository;

import com.medee.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    Optional<Category> findBySlug(String slug);
    
    Optional<Category> findByName(String name);
    
    List<Category> findByActiveTrue();
    
    List<Category> findByActiveTrueOrderByDisplayOrderAsc();
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);
}

