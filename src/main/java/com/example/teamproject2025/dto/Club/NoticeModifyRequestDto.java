package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Notice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeModifyRequestDto {
    private String noticeTitle;
    private String noticeContents;
    private String thumbUrl;
}
