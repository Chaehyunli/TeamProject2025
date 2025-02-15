package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Club;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubSummaryDto {
    private Long clubId;
    private String clubName;
    private String description;
    private String thumbUrl;
    private Long categoryId;
    private Long universityId;
    private int membersCount;
    private List<ClubLeaderDto> leaders;

    public static ClubSummaryDto fromEntity(Club club) {
        return ClubSummaryDto.builder()
                .clubId(club.getClubId())
                .clubName(club.getClubName())
                .description(club.getDescription())
                .thumbUrl(club.getThumbUrl())
                .categoryId(club.getCategory().getCategoryId()) // JSON 키 맞춤
                .universityId(club.getUniversity().getUniversityId())
                .membersCount(0) // 현재 멤버 수 추후 추가 가능
                .leaders(club.getLeaders().stream().map(ClubLeaderDto::fromEntity).collect(Collectors.toList())) // 리더 정보 변환
                .build();
    }
}
