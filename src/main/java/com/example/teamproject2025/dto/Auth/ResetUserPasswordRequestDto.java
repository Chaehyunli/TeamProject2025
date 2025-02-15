package com.example.teamproject2025.dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetUserPasswordRequestDto {

    @Email(message = "유효한 이메일을 입력하세요.")
    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    private String email;

    @NotNull(message = "이메일 인증 상태가 필요합니다.")
    private Boolean isEmailVerified;

    @NotBlank(message = "새로운 비밀번호를 입력하세요.")
    @Size(min = 8, max = 20, message = "비밀번호는 8~20자 사이여야 합니다.")
    private String newPassword;

    @NotBlank(message = "비밀번호 확인을 입력하세요.")
    private String confirmPassword;

    @NotBlank
    private String username;

    // 두 개의 비밀번호가 일치하는지 확인
    public boolean isPasswordMatched(String newPassword, String confirmPassword) {
        return this.newPassword != null && this.newPassword.equals(this.confirmPassword);
    }
}