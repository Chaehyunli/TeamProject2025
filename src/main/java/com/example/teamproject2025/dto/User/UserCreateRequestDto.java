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
    private String universityName;
    private String studentId;
    private String profileImage = "https://i.sstatic.net/l60Hf.png";

    // DTO → Entity 변환 메서드
    public User toEntity(Integer universityId, String encodedPassword) {
        return User.builder()
                .username(this.username)
                .password(encodedPassword) // 암호화된 비밀번호
                .name(this.name)
                .email(this.email)
                .universityId(universityId)
                .studentId(studentId)
                .profileImage(profileImage)
                .build();
    }
}
