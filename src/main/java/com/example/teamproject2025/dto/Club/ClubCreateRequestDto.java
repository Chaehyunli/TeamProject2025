package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Category;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.University.University;
import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubCreateRequestDto {
    private String clubName;
    private String category;
    private String description;
    private Long universityId;
    private String thumbUrl;
    private Long presidentId;

    // DTO → Entity 변환 메서드
    public Club toEntity(Category category, University university, User president) {
        return Club.builder()
                .clubName(this.clubName)
                .description(this.description)
                .category(category) // 객체 참조
                .university(university) // 객체 참조
                .president(president) // 객체 참조
                .thumbUrl(this.thumbUrl != null ? this.thumbUrl : "/uploads/clubs/default-thumbnail.png")
                .build();
    }
}
