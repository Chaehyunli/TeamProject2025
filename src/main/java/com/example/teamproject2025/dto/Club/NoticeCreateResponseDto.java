package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeCreateResponseDto {
    private Long noticeId;
    private Long clubId;
    private Long authorId;
    private String noticeTitle;
    private String noticeContents;
    private String thumbUrl;
    private LocalDateTime createdAt;

    public static NoticeCreateResponseDto fromEntity(Notice notice) {
        return NoticeCreateResponseDto.builder()
                .noticeId(notice.getNoticeId())
                .clubId(notice.getClub().getClubId())
                .authorId(notice.getUser().getUserId())
                .noticeTitle(notice.getNoticeTitle())
                .noticeContents(notice.getNoticeContents())
                .thumbUrl(notice.getThumbUrl())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
