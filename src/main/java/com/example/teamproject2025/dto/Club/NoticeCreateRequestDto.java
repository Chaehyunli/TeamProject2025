package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Club.Notice;
import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeCreateRequestDto {
    private String title;
    private String contents;
    private String thumbUrl;

    public Notice toEntity(Club club, User user){
        return Notice.builder()
                .club(club)
                .user(user)
                .title(title)
                .contents(contents)
                .thumbUrl(thumbUrl)
                .build();
    }
}
