package com.example.teamproject2025.dto.Membership;

import com.example.teamproject2025.entity.Membership.UserClub;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserClubResponseDto {
    private Long clubId;
    private String clubName;
    private String roleName; // 사용자의 클럽 내 역할

    @Builder
    public UserClubResponseDto(Long clubId, String clubName, String roleName) {
        this.clubId = clubId;
        this.clubName = clubName;
        this.roleName = roleName;
    }

    // UserClub 엔티티 → UserClubResponseDto 변환
    public static UserClubResponseDto fromEntity(UserClub userClub) {
        return UserClubResponseDto.builder()
                .clubId(userClub.getClub().getClubId())
                .clubName(userClub.getClub().getClubName())
                .roleName(userClub.getRole() != null ? userClub.getRole().getRoleName().name() : "MEMBER")
                .build();
    }
}
