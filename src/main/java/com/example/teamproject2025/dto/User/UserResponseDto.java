package com.example.teamproject2025.dto.User;

import com.example.teamproject2025.dto.Club.ClubSummaryDto;
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
}
