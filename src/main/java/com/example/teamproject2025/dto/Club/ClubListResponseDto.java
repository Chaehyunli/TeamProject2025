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
@Schema(description = "동아리 목록 및 페이지네이션 정보를 담은 응답 DTO")
public class ClubListResponseDto {
    @Schema(description = "페이지네이션 정보", implementation = PaginationDto.class)
    private PaginationDto pagination;

    @Schema(description = "조회된 동아리 목록", implementation = ClubSummaryDto.class)
    private List<ClubSummaryDto> clubs;

    public static ClubListResponseDto fromEntity(List<Club> clubList, int total, int limit, int offset) {
        return ClubListResponseDto.builder()
                .pagination(new PaginationDto(total, limit, offset))
                .clubs(clubList.stream().map(ClubSummaryDto::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
