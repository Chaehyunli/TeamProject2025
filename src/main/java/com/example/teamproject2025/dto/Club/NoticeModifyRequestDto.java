package com.example.teamproject2025.dto.Club;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeModifyRequestDto {
    private String title;
    private String contents;
    private String thumbUrl;
}
