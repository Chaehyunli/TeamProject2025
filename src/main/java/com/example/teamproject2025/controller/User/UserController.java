package com.example.teamproject2025.controller.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.User.*;
import com.example.teamproject2025.service.User.BanUserService;
import com.example.teamproject2025.service.User.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users") // API 엔드포인트
public class UserController {

    private final UserService userService;

    // 사용자 등록
    @PostMapping("/register")
    public ResponseEntity<CommonResponseDto<UserResponseDto>> register(@RequestBody @Valid UserCreateRequestDto userCreateRequestDto) {
        UserResponseDto userResponse = userService.register(userCreateRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.success(HttpStatus.CREATED.value(), "User registered successfully", userResponse));
    }

    // 사용자 탈퇴 (이메일 인증 필수)
    @DeleteMapping()
    public ResponseEntity<CommonResponseDto<Void>> deleteUser(HttpSession session) {
        session.setAttribute("deleted_mail_verified",true);
        userService.deleteUser(session);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "User deleted successfully"));
    }

    @GetMapping("/list")
    public ResponseEntity<?> userList(){
        List<UserListResDto> dtos = userService.findAll();
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "User List", dtos));
    }

    // 현재 로그인된 사용자 정보 조회 API
    @GetMapping("/profile")
    public ResponseEntity<CommonResponseDto<UserResponseDto>> getUserProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        UserResponseDto userResponse = userService.getUserProfile(userId);

        return ResponseEntity.ok(
                CommonResponseDto.success(HttpStatus.OK.value(), "사용자 정보 조회 성공", userResponse)
        );
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponseDto> updateUserProfile(
            HttpSession session, @RequestBody UserUpdateRequestDto dto) {

        Long userId = (Long) session.getAttribute("userId"); // 세션에서 유저 ID 가져오기
        if (userId == null) {
            return ResponseEntity.status(401).build(); // 로그인되지 않은 경우
        }
        System.out.println("Session User ID: " + userId);

        UserResponseDto updatedUser = userService.updateUserProfile(userId, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<CommonResponseDto<UserResponseDto>> getUserProfile(@PathVariable Long userId) {
        UserResponseDto userProfile = userService.getUserProfile(userId);
        return ResponseEntity.ok(
                CommonResponseDto.success(200, "User profile retrieved successfully", userProfile)
        );
    }

    // 사용자 프로필 이미지를 기본 이미지로 설정
    @PatchMapping("/profile/image/reset")
    public ResponseEntity<CommonResponseDto<Void>> resetUserProfileImage(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        userService.resetUserProfileImage(userId);
        return ResponseEntity.ok(CommonResponseDto.success(200, "기본 프로필 이미지로 변경 완료"));
    }
}
