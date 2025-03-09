package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Club;
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
public class ClubResponseDto {
    private Long clubId;
    private String clubName;
    private Long categoryId;
    private String description;
    private List<ClubLeaderDto> leaders;
    private int membersCount;
    private String imageUrl;
    private LocalDateTime createdAt;

    public static ClubResponseDto fromEntity(Club club, List<ClubLeaderDto> leaders, int membersCount) {
        return ClubResponseDto.builder()
                .clubId(club.getClubId())
                .clubName(club.getClubName())
                .categoryId(club.getCategory().getCategoryId())
                .description(club.getDescription())
                .leaders(leaders)
                .membersCount(membersCount)
                .imageUrl(club.getThumbUrl())
                .createdAt(club.getCreatedAt())
                .build();
    }
}
