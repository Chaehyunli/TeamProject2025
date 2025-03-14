package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Membership.UserClub;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubLeaderDto {
    private Long userId;
    private String name;
    private String roleName;

    public static ClubLeaderDto fromEntity(UserClub userClub) {
        return ClubLeaderDto.builder()
                .userId(userClub.getUser() != null ? userClub.getUser().getUserId() : null)
                .name(userClub.getUser() != null ? userClub.getUser().getName() : null)
                .roleName(userClub.getRole().getRoleName().name())
                .build();
    }
}
