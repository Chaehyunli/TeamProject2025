package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Club;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubListResponseDto {
    private PaginationDto pagination; // 페이지네이션 정보
    private List<ClubSummaryDto> clubs; // 동아리 목록

    public static ClubListResponseDto fromEntity(List<Club> clubList, int total, int limit, int offset) {
        return ClubListResponseDto.builder()
                .pagination(new PaginationDto(total, limit, offset))
                .clubs(clubList.stream().map(ClubSummaryDto::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
