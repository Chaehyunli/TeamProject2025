package com.example.teamproject2025.controller.Auth;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Auth.EmailRequestDto;
import com.example.teamproject2025.dto.Auth.EmailResponseDto;
import com.example.teamproject2025.dto.Auth.EmailVerificationDto;
import com.example.teamproject2025.dto.User.UserLoginRequestDto;
import com.example.teamproject2025.dto.User.UserLoginResponseDto;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.User.UserRepository;
import com.example.teamproject2025.service.Auth.EmailServiceImpl;
import com.example.teamproject2025.service.Auth.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final EmailServiceImpl emailServiceImpl;
    private final LoginService loginService;

    // 이메일 인증 요청
    @PostMapping("/email")
    public ResponseEntity<CommonResponseDto<Object>> requestEmailVerification(@RequestBody @Validated EmailRequestDto request) {
        emailServiceImpl.sendVerificationEmail(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "Verification email sent successfully", null));
    }

    // 이메일 인증 확인
    @PostMapping("/email/verify")
    public ResponseEntity<CommonResponseDto<Object>> verifyEmail(@RequestBody @Validated EmailVerificationDto request) {
        EmailResponseDto emailResponseDto = emailServiceImpl.verifyEmail(request.getEmail(), request.getVerificationCode());
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "Email verified successfully", emailResponseDto));
    }

    // 로그인 요청을 처리하는 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<CommonResponseDto<UserLoginResponseDto>> login(
            @RequestBody @Validated UserLoginRequestDto dto,
            HttpSession session
    ) {
        UserLoginResponseDto responseDto = loginService.login(dto, session);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "Login successfully", responseDto));
    }

    // 로그인한 유저 정보 가져오기
    @GetMapping("/session")
    public ResponseEntity<CommonResponseDto<String>> getSessionUser(HttpSession session) {
        Object username = session.getAttribute("username"); // 세션에서 "username" 가져오기
        if (username == null) {
            throw new IllegalStateException("로그인된 사용자가 없습니다.");
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "Session user retrieved", username.toString()));
    }
}

/* 💡Descriptions -- Refactoring @dev_taehuyn
*
*     Ref1. 생성자 주입 코드 제거 -> Spring Container(IoC) 에서 Bean 생성해서 알아서 처리함
*
*     Ref2. Controller 는 Request/Response 만 처리한다. 비즈니스 로직은 Service Layer 에서 처리한다.
*     Ref3. Session 부분은 원칙적으로는 Service Layer 에서 처리 로직을 써야하지만, 코드가 단순한 관계로 그냥 씀
*
* */