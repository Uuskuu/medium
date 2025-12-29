package com.medee.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private String id;
    private String name;
    private String slug;
    private String description;
    private String iconUrl;
    private Boolean active;
    private Integer displayOrder;
    private Integer postCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

