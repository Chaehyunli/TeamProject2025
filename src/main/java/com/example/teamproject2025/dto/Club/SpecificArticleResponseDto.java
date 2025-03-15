package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.dto.Auth.AuthorDto;
import com.example.teamproject2025.entity.Club.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SpecificArticleResponseDto {
    private Long article_id;
    private AuthorDto author;
    private boolean is_notice;
    private String title;
    private String contents;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private String thumbUrl;

    public static SpecificArticleResponseDto fromEntity(Article article) {
        return SpecificArticleResponseDto.builder()
                .article_id(article.getArticleId())
                .author(new AuthorDto(article.getUser().getUserId(), article.getUser().getUsername()))
                .is_notice(article.is_notice())
                .title(article.getTitle())
                .contents(article.getContents())
                .created_at(article.getCreatedAt())
                .updated_at(article.getUpdatedAt())
                .thumbUrl(article.getThumbUrl())
                .build();
    }
}


