package com.example.teamproject2025.dto.User;


import com.example.teamproject2025.entity.User.User;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequestDto {
    private String email;
    private Boolean isEmailVerified; // email 변경하면 재인증 해야 함.
    private String profileImage;
    private String name;
    private String studentId;
    private String department;
}