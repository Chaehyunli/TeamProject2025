package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Article;
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
public class ArticleListResponseDto {
    private PaginationDto pagination;
    private List<ArticleResponseDto> articles;

    public static ArticleListResponseDto fromEntity(List<Article> articleList, int total, int limit, int offset) {
        return ArticleListResponseDto.builder()
                .pagination(new PaginationDto(total, limit, offset))
                .articles(articleList.stream().map(ArticleResponseDto::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
