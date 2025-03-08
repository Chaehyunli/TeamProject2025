package com.example.teamproject2025.dto.Chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyChatListResDto {
    private Long roomId;
    private String roomName;
    private Boolean isGroupChat;
    private Long unReadCount;
}
