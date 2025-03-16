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

    public static UserResponseDto toDTO(User user, String universityName) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .studentId(user.getStudentId())
                .universityId(user.getUniversityId())
                .universityName(universityName)
                .isEmailVerified(user.getIsEmailVerified())
                .isUniVerified(user.getIsUniVerified())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static UserResponseDto toDTO(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .studentId(user.getStudentId())
                .department(user.getDepartment())
                .isEmailVerified(user.getIsEmailVerified())
                .isUniVerified(user.getIsUniVerified())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static UserResponseDto toDTO(
            User user,
            List<ClubSummaryDto> joinedClubs,
            List<ClubSummaryDto> managedClubs,
            String universityName
    ) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .studentId(user.getStudentId())
                .department(user.getDepartment())
                .profileImage(user.getProfileImage())
                .universityId(user.getUniversityId())
                .universityName(universityName)
                .isEmailVerified(user.getIsEmailVerified())
                .isUniVerified(user.getIsUniVerified())
                .createdAt(user.getCreatedAt())
                .joinedClubs(joinedClubs)   // 가입한 동아리 목록 추가
                .managedClubs(managedClubs) // 운영하는 동아리 목록 추가
                .build();
    }
}
