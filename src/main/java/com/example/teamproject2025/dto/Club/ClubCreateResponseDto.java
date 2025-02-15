package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Club;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubCreateResponseDto {
    private Long clubId;
    private String clubName;
    private String description;
    private String thumbUrl;
    private Long categoryId;
    private Long universityId;
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
