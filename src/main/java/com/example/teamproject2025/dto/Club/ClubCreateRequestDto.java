package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.constant.DefaultImage;
import com.example.teamproject2025.entity.Club.Category;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.University.University;
import com.example.teamproject2025.entity.User.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubCreateRequestDto {
    @Schema(description = "동아리 이름", example = "AI 연구 동아리")
    private String clubName;

    @Schema(description = "카테고리 이름", example = "학술")
    private String category;

    @Schema(description = "동아리 설명", example = "인공지능 기술을 공부하는 동아리입니다.")
    private String description;

    @Schema(description = "대학교 ID", example = "1")
    private Long universityId;

    @Builder.Default
    @Schema(description = "동아리 썸네일 객체 이름", example = "default-thumbnail.jpg")
    private String thumbUrl = DefaultImage.CLUB_THUMBNAIL;

    @Schema(description = "동아리 회장 사용자 ID", example = "10")
    private Long presidentId;

    // DTO → Entity 변환 메서드
    public Club toEntity(Category category, University university, User president) {
        return Club.builder()
                .clubName(this.clubName)
                .description(this.description)
                .category(category) // 객체 참조
                .university(university) // 객체 참조
                .president(president) // 객체 참조
                .thumbUrl(this.thumbUrl)
                .build();
    }
}
