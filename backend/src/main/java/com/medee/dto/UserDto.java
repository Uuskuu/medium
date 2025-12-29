package com.medee.dto;

import com.medee.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String username;
    private String email;
    private UserRole role;
    private Integer reputationPoints;
    private String displayName;
    private String bio;
    private String avatar;
}

