package com.medee.dto;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private String description;
    private String iconUrl;
    private Boolean active;
    private Integer displayOrder;
}

