package com.example.teamproject2025.dto.User;

import com.example.teamproject2025.constant.DefaultImage;
import com.example.teamproject2025.entity.User.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @NotBlank
    @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다.")
    @Pattern(
            regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>_])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>_]{8,20}$",
            message = "비밀번호는 8자 이상 20자 이하로 특수문자 1개 이상 포함해야 합니다."
    )
    private String password;

    private String name;
    private String email;
    private String universityName;
    private String studentId;
    @Builder.Default
    private String profileImage = DefaultImage.PROFILE_IMAGE;
    @Builder.Default
    private Boolean isEmailVerified = false; // Ref1

    // DTO → Entity 변환 메서드
    public User toEntity(Long universityId, String encodedPassword) {
        return User.builder()
                .username(this.username)
                .password(encodedPassword) // 암호화된 비밀번호
                .name(this.name)
                .email(this.email)
                .universityId(universityId)
                .studentId(this.studentId)
                .profileImage(this.profileImage)
                .isEmailVerified(this.isEmailVerified)
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