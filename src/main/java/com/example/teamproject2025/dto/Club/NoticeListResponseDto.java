package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeListResponseDto {

    private PaginationDto pagination;
    private List<NoticeResponseDto> noticeList;

    public static NoticeListResponseDto fromEntity(List<Notice> noticeList, int total, int limit, int offset) {
        return NoticeListResponseDto.builder()
                .pagination(new PaginationDto(total, limit, offset))
                .noticeList(noticeList.stream().map(NoticeResponseDto::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
