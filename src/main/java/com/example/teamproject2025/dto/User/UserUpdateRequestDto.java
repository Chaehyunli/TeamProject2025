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
public class UserUpdateRequestDto {
    private String email;
    private String profileImage;

    public User toEntity() {
        return User.builder()
                .email(email)
                .profileImage(profileImage)
                .build();
    }
}
