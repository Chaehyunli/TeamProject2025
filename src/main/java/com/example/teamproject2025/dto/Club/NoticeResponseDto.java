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
public class NoticeResponseDto {
    private Long noticeId;
    private Long clubId;
    private AuthorDto author;
    private String title;
    private String contents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String thumbUrl;

    public static NoticeResponseDto fromEntity(Notice notice) {
        return NoticeResponseDto.builder()
                .noticeId(notice.getNoticeId())
                .clubId(notice.getClub().getClubId())
                .author(new AuthorDto(notice.getUser().getUserId(), notice.getUser().getUsername()))
                .title(notice.getTitle())
                .contents(notice.getContents())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .thumbUrl(notice.getThumbUrl())
                .build();
    }
}
