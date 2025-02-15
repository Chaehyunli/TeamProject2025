package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Membership.UserClub;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubLeaderDto {
    private Long user_id;
    private String user_name;
    private String role_name;

    public static ClubLeaderDto fromEntity(UserClub userClub) {
        return ClubLeaderDto.builder()
                .user_id(userClub.getUser() != null ? userClub.getUser().getUserId() : null)
                .user_name(userClub.getUser() != null ? userClub.getUser().getName() : null)
                .role_name(userClub.getRole().getRoleName().name())
                .build();
    }
}