package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Membership.UserClub;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubLeaderDto {
    @Schema(description = "사용자 고유 ID", example = "1")
    private Long userId;

    @Schema(description = "사용자 본명", example = "홍길동")
    private String name;

    @Schema(description = "동아리 내 역할(회장/부회장)", example = "PRESIDENT/VICE_PRESIDENT")
    private String roleName;

    public static ClubLeaderDto fromEntity(UserClub userClub) {
        return ClubLeaderDto.builder()
                .userId(userClub.getUser() != null ? userClub.getUser().getUserId() : null)
                .name(userClub.getUser() != null ? userClub.getUser().getName() : null)
                .roleName(userClub.getRole() != null ? userClub.getRole().getRoleName().name() : null)
                .build();
    }
}
