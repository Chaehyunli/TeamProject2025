package com.example.teamproject2025.controller.EmailAuth;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.EmailAuth.EmailRequestDto;
import com.example.teamproject2025.dto.EmailAuth.EmailVerificationDto;
import com.example.teamproject2025.service.EmailAuth.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/email")
@RequiredArgsConstructor
public class EmailAuthController {
    private final EmailService emailService;

    // 이메일 인증 요청
    @PostMapping
    public ResponseEntity<CommonResponseDto<Object>> requestEmailVerification(@RequestBody @Validated EmailRequestDto request) {
        emailService.sendVerificationEmail(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "Verification email sent successfully", null));
    }

    // 이메일 인증 확인
    @PostMapping("/verify")
    public ResponseEntity<CommonResponseDto<Object>> verifyEmail(@RequestBody @Validated EmailVerificationDto request) {
        emailService.verifyEmail(request.getEmail(), request.getVerificationCode());
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "Email verified successfully", null));
    }
}
