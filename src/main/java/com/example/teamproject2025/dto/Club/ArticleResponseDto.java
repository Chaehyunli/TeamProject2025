package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArticleResponseDto {
    private Long articleId;
    private Long clubId;
    private boolean is_notice;
    private String title;
    private String contents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String thumbUrl;

    public static ArticleResponseDto fromEntity(Article article) {
        return ArticleResponseDto.builder()
                .articleId(article.getArticleId())
                .clubId(article.getClub().getClubId())
                .is_notice(article.is_notice())
                .title(article.getTitle())
                .contents(article.getContents())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .thumbUrl(article.getThumbUrl())
                .build();
    }
}
