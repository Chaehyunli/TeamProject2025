package com.example.teamproject2025.dto.User;

import com.example.teamproject2025.dto.Club.ClubSummaryDto;
import com.example.teamproject2025.entity.User.User;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "사용자 프로필 응답 DTO")
public class UserResponseDto {
    @Schema(description = "사용자 고유 ID", example = "1")
    private Long userId;

    @Schema(description = "사용자 ID", example = "hong123")
    private String username;

    @Schema(description = "이메일 주소", example = "hong123@example.com")
    private String email;

    @Schema(description = "사용자 본명", example = "홍길동")
    private String name;

    @Schema(description = "학번", example = "60222323")
    private String studentId;

    @Schema(description = "대학교 고유 ID", example = "1")
    private Long universityId;

    @Schema(description = "대학교 이름", example = "한국대학교")
    private String universityName;

    @Schema(description = "이메일 인증 여부", example = "true")
    private Boolean isEmailVerified;

    @Schema(description = "대학교 인증 여부", example = "true")
    private Boolean isUniVerified;

    @Schema(description = "프로필 이미지", example = "profile.jpg")
    private String profileImage;

    @Schema(description = "계정 생성일", example = "2024-01-01T12:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "학과", example = "컴퓨터공학과")
    private String department;

    @Schema(description = "가입된 동아리 목록")
    private List<ClubSummaryDto> joinedClubs;

    @Schema(description = "관리하는 동아리 목록")
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
