package com.example.teamproject2025.controller.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserListResDto;
import com.example.teamproject2025.dto.User.UserResponseDto;
import com.example.teamproject2025.service.User.UserService;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity<CommonResponseDto<UserResponseDto>> register(@RequestBody UserCreateRequestDto userCreateRequestDto) {
        UserResponseDto userResponse = userService.register(userCreateRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.success(HttpStatus.CREATED.value(), "User registered successfully", userResponse));
    }

    // 사용자 탈퇴 (이메일 인증 필수)
    @DeleteMapping()
    public ResponseEntity<CommonResponseDto<Void>> deleteUser(HttpSession session) {
        session.setAttribute("deleted_mail_verified",true);
        return userService.deleteUser(session);
    }

    @GetMapping("/list")
    public ResponseEntity<?> userList(){
        List<UserListResDto> dtos = userService.findAll();
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "User List", dtos));
    }
}
