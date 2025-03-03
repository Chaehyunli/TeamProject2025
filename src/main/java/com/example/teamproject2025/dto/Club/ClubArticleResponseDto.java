package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Club;
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
    private String content;
    private String thumbUrl;
    private LocalDateTime createdAt;

    public static ClubArticleResponseDto formEntity(Article article) {
        return ClubArticleResponseDto.builder()
                .articleId(article.getArticleId())
                .clubId(article.getClub().getClubId())
                .userId(article.getUser().getUserId())
                .title(article.getTitle())
                .content(article.getContent())
                .thumbUrl(article.getThumbUrl())
                .createdAt(article.getCreatedAt())
                .build();
    }
}
