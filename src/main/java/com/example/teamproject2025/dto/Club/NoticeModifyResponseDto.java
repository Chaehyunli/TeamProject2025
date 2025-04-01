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
public class NoticeModifyResponseDto {
    private Long noticeId;
    private Long clubId;
    private Long authorId;
    private String title;
    private String contents;
    private String thumbUrl;
    private LocalDateTime updateTime;

    public static NoticeModifyResponseDto fromEntity(Notice notice) {
        return NoticeModifyResponseDto.builder()
                .noticeId(notice.getNoticeId())
                .clubId(notice.getClub().getClubId())
                .authorId(notice.getUser().getUserId())
                .title(notice.getTitle())
                .contents(notice.getContents())
                .thumbUrl(notice.getThumbUrl())
                .updateTime(notice.getUpdatedAt())
                .build();
    }
}
