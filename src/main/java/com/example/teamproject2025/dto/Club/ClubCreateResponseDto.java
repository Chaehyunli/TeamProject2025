package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.constant.DefaultImage;
import com.example.teamproject2025.entity.Club.Club;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubCreateResponseDto {
    @Schema(description = "동아리 고유 ID", example = "AI 연구 동아리")
    private Long clubId;

    @Schema(description = "동아리 이름", example = "AI 연구 동아리")
    private String clubName;

    @Schema(description = "카테고리 고유 ID", example = "3")
    private Long categoryId;

    @Schema(description = "동아리 설명", example = "인공지능 기술을 공부하는 동아리입니다.")
    private String description;

    @Schema(description = "대학교 ID", example = "1")
    private Long universityId;

    @Builder.Default
    @Schema(description = "동아리 썸네일 객체 이름", example = "default-thumbnail.jpg")
    private String thumbUrl = DefaultImage.CLUB_THUMBNAIL;

    @Schema(description = "동아리 회장 사용자 ID", example = "10")
    private Long presidentId;
    public static ClubCreateResponseDto fromEntity(Club club) {
        return ClubCreateResponseDto.builder()
                .clubId(club.getClubId())
                .clubName(club.getClubName())
                .description(club.getDescription())
                .thumbUrl(club.getThumbUrl())
                .categoryId(club.getCategory().getCategoryId())
                .universityId(club.getUniversity().getUniversityId())
                .presidentId(club.getPresident().getUserId())
                .build();
    }
}
