package com.example.teamproject2025.dto.Membership;

import com.example.teamproject2025.dto.Club.ClubLeaderDto;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Membership.UserClub;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserClubResponseDto {
    private Long clubId;
    private String clubName;
    private String roleName; // 사용자의 클럽 내 역할
    private String description;
    private String thumbUrl;
    private LocalDateTime joinedAt;
    private List<ClubLeaderDto> leaders;

    public static UserClubResponseDto fromEntity(UserClub userClub) {
        Club club = userClub.getClub();

        return UserClubResponseDto.builder()
                .clubId(club.getClubId())
                .clubName(club.getClubName())
                .description(club.getDescription())
                .thumbUrl(club.getThumbUrl())
                .joinedAt(userClub.getJoinedAt())
                .roleName(userClub.getRole() != null ? userClub.getRole().getRoleName().name() : "MEMBER")
                .leaders(
                        club.getLeaders().stream()
                                .map(ClubLeaderDto::fromEntity)
                                .collect(Collectors.toList())
                )
                .build();
    }
}
