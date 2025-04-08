package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Club;
import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "동아리 고유 ID", example = "1")
    private Long clubId;

    @Schema(description = "동아리 이름", example = "동아리모아")
    private String clubName;

    @Schema(description = "동아리 소개 설명", example = "여기는 동아리모아입니다. 환영합니다.")
    private String description;

    @Schema(description = "동아리 썸네일 이미지 파일명", example = "thumbnail.png")
    private String thumbUrl;

    @Schema(description = "동아리가 속한 카테고리 ID", example = "2")
    private Long categoryId;

    @Schema(description = "소속 대학교 ID", example = "1")
    private Long universityId;

    @Schema(description = "동아리 총 가입 인원 수", example = "33")
    private int membersCount;

    @Schema(description = "동아리 리더 정보 리스트")
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
