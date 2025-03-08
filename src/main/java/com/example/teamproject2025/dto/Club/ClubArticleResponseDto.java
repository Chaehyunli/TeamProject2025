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
public class ClubArticleResponseDto {

    private Long articleId;
    private Long clubId;
    private Long userId;
    private String title;
    private String contents;
    private String thumbUrl;
    private LocalDateTime createdAt;

    public static ClubArticleResponseDto formEntity(Article article) {
        return ClubArticleResponseDto.builder()
                .articleId(article.getArticleId())
                .clubId(article.getClub().getClubId())
                .userId(article.getUser().getUserId())
                .title(article.getTitle())
                .contents(article.getContents())
                .thumbUrl(article.getThumbUrl())
                .createdAt(article.getCreatedAt())
                .build();
    }
}
