package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubArticleRequestDto {
    private String title;
    private String contents;
    private String thumbUrl;

    public Article toEntity(Club club, User user) {
        return Article.builder()
                .club(club)
                .user(user)
                .title(this.title)
                .contents(this.contents)
                .thumbUrl(this.thumbUrl)
                .build();
    }
}
