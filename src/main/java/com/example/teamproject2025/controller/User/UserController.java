package com.example.teamproject2025.controller.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserResponseDto;
import com.example.teamproject2025.service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users") // API 엔드포인트
public class UserController {

    private final UserService userService;

    // 사용자 등록
    @PostMapping("/register")
    public ResponseEntity<CommonResponseDto<UserResponseDto>> register(@RequestBody UserCreateRequestDto userCreateRequestDto) {
        UserResponseDto userResponse = userService.register(userCreateRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.success(HttpStatus.CREATED.value(), "User registered successfully", userResponse));
    }
}
