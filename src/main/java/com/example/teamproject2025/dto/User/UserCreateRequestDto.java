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
    private Boolean isEmailVerified = false; // Ref1
    private Boolean isUniVerified = false;

    // DTO → Entity 변환 메서드
    public User toEntity(Long universityId, String encodedPassword) {
        return User.builder()
                .username(this.username)
                .password(encodedPassword) // 암호화된 비밀번호
                .name(this.name)
                .email(this.email)
                .universityId(universityId)
                .studentId(studentId)
                .profileImage(profileImage)
                .isEmailVerified(isEmailVerified)
                .isUniVerified(this.isUniVerified != null ? this.isUniVerified : false)
                .build();
    }
}

/* 💡Descriptions
*
*     Ref1. UserServiceImpl 의 Description 을 보면 알겠지만,
*           유저 입장에서 흐름 상 이메일 인증이 먼저 일어난다.
*           따라서 RequestDto 에 isEmailVerified 가 포함된다.
*           이 값을 유저가 기입하는건 당연히 아니고, 이메일 인증이 완료되면
*           저절로 isEmailVerified 가 업데이트 되도록 구현 할 것이다.
*
* */