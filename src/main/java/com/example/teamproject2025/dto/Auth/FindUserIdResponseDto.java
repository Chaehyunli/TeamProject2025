package com.example.teamproject2025.dto.Auth;

import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FindUserIdResponseDto {
    private long userId;
    private String username;
    private String email;

    public static FindUserIdResponseDto toDTO(User user){
        return FindUserIdResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
