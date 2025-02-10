package com.example.teamproject2025.dto.EmailAuth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationDto {
    private String email; // 이메일
    private String verificationCode; // 6자리 인증번호
}
