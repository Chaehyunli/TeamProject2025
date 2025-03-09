package com.example.teamproject2025.dto.Chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageReqDto {
    private Long roomId;
    private String message;
    private String senderEmail;
    private String createdAt;
}
