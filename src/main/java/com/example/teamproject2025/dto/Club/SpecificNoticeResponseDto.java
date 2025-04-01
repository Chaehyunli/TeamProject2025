package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.dto.Auth.AuthorDto;
import com.example.teamproject2025.entity.Club.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecificNoticeResponseDto {
    private Long noticeId;
    private AuthorDto author;
    private String title;
    private String contents;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private String thumbUrl;

    public static SpecificNoticeResponseDto fromEntity(Notice notice){
        return SpecificNoticeResponseDto.builder()
                .noticeId(notice.getNoticeId())
                .author(new AuthorDto(notice.getUser().getUserId(), notice.getUser().getUsername()))
                .title(notice.getTitle())
                .contents(notice.getContents())
                .created_at(notice.getCreatedAt())
                .updated_at(notice.getUpdatedAt())
                .thumbUrl(notice.getThumbUrl())
                .build();
    }
}
