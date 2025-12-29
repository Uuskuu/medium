package com.medee.controller;

import com.medee.dto.ApiResponse;
import com.medee.dto.UserDto;
import com.medee.model.User;
import com.medee.model.UserRole;
import com.medee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserRepository userRepository;

    @GetMapping("/top-authors")
    public ResponseEntity<ApiResponse<List<UserDto>>> getTopAuthors(
            @RequestParam(defaultValue = "5") int limit) {
        List<User> topAuthors = userRepository.findByRoleOrderByReputationPointsDesc(UserRole.AUTHOR);
        
        List<UserDto> topAuthorDtos = topAuthors.stream()
                .limit(limit)
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(topAuthorDtos, "Top authors retrieved successfully"));
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .reputationPoints(user.getReputationPoints())
                .displayName(user.getProfile() != null ? user.getProfile().getDisplayName() : user.getUsername())
                .bio(user.getProfile() != null ? user.getProfile().getBio() : null)
                .avatar(user.getProfile() != null ? user.getProfile().getAvatar() : null)
                .build();
    }
}

