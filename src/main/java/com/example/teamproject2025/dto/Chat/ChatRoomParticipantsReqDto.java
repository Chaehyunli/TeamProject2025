package com.example.teamproject2025.dto.Chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomParticipantsReqDto {
    private String email;
    private String name;
    private String profileImage;
}