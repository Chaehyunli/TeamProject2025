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
public class UserCreateRequestDto {
    private String username;
    private String password;
    private String name;
    private String email;
    private String studentId;
    private Integer universityId; // university entity 로 받아와야 함

    public User toEntity() {
        return User.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .studentId(studentId)
                .universityId(universityId)
                .build();
    }
}
