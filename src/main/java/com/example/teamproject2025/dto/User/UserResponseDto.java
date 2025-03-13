package com.example.teamproject2025.dto.User;

import com.example.teamproject2025.dto.Club.ClubSummaryDto;
import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long userId;
    private String username;
    private String email;
    private String name;
    private String studentId;
    private Long universityId;
    private String universityName;
    private Boolean isEmailVerified;
    private Boolean isUniVerified;
    private String profileImage;
    private LocalDateTime createdAt;
    private String department;

    private List<ClubSummaryDto> joinedClubs;
    private List<ClubSummaryDto> managedClubs;

    public static UserResponseDto toDTO(User user, UserCreateRequestDto dto) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .studentId(user.getStudentId())
                .universityId(user.getUniversityId())
                .universityName(dto.getUniversityName())
                .isEmailVerified(user.getIsEmailVerified())
                .isUniVerified(user.getIsUniVerified())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
