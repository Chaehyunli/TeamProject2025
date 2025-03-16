package com.example.teamproject2025.dto.User;

import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponseDto {
    Long userId;
    String username;
    String name;
    String email;
    String profileImage;

    public static UserLoginResponseDto toDTO(User user){
        return UserLoginResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .build();
    }
}
