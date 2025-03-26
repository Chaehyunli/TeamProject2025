package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserListResDto;
import com.example.teamproject2025.dto.User.UserResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import jakarta.servlet.http.HttpSession;

import java.util.List;

public interface UserService {
    UserResponseDto register(UserCreateRequestDto userCreateRequestDto);
    UserResponseDto updateUserProfile(Long userId, UserUpdateRequestDto dto);
    void deleteUser(HttpSession session);
    List<UserListResDto> findAll();
    UserResponseDto getUserProfile(Long userId);
    void resetUserProfileImage(Long userId);
}
