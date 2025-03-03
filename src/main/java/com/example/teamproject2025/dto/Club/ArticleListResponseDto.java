package com.example.teamproject2025.dto.Club;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArticleListResponseDto {
    private Long total;
    private Long Limit;
    private Long offset;
    private List<ArticleResponseDto> articles;
}
