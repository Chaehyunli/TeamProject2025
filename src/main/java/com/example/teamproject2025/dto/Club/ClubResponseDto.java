package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Club;
import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "동아리 고유 ID", example = "1")
    private Long clubId;

    @Schema(description = "동아리 이름", example = "AI 연구 동아리")
    private String clubName;

    @Schema(description = "카테고리 ID", example = "3")
    private Long categoryId;

    @Schema(description = "동아리 설명", example = "인공지능 기술을 함께 공부하는 동아리입니다.")
    private String description;

    @Schema(description = "동아리 리더 목록")
    private List<ClubLeaderDto> leaders;

    @Schema(description = "동아리 전체 회원 수", example = "42")
    private int membersCount;

    @Schema(description = "썸네일 이미지 객체 이름", example = "thumb.png")
    private String thumbUrl;

    @Schema(description = "동아리 개설일", example = "2024-01-01T10:30:00")
    private LocalDateTime createdAt;

    public static ClubResponseDto fromEntity(Club club, List<ClubLeaderDto> leaders, int membersCount) {
        return ClubResponseDto.builder()
                .clubId(club.getClubId())
                .clubName(club.getClubName())
                .categoryId(club.getCategory().getCategoryId())
                .description(club.getDescription())
                .leaders(leaders)
                .membersCount(membersCount)
                .thumbUrl(club.getThumbUrl())
                .createdAt(club.getCreatedAt())
                .build();
    }
}
