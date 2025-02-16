package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;

public interface UserService {
    UserResponseDto register(UserCreateRequestDto userCreateRequestDto);
    UserResponseDto updateUserProfile(Long userId, UserUpdateRequestDto dto);
    // UserResponseDto update(Long userId, UserUpdateRequestDto userUpdatedRequestDto);
    ResponseEntity<CommonResponseDto<Void>> deleteUser(HttpSession session);
    UserResponseDto getUserProfile(Long userId);
}
