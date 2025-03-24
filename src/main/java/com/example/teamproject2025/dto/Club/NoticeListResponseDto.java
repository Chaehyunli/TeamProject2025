package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeListResponseDto {

    private PaginationDto pagination;
    private List<NoticeResponseDto> noticeList;
}
