package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleModificationRequestDto {
    private String title;
    private String contents;
    private String thumbUrl;
}
