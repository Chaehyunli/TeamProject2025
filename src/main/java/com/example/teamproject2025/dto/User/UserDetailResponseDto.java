package com.example.teamproject2025.dto.User;

import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponseDto {
    private String username;
    private String studentId;
    private String universityName;
    private String email;
    private String profileImage;
    private List<ClubInfoDto> joinedClubs;  // 가입한 동아리 정보
    private List<ClubInfoDto> managedClubs; // 관리하는 동아리 정보
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class ClubInfoDto {
    private String thumbnail;
    private String clubName;
}
