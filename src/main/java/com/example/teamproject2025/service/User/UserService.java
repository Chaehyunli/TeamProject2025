package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;

public interface UserService {
    UserResponseDto register(UserCreateRequestDto userCreateRequestDto);
    UserResponseDto update(Long userId, UserUpdateRequestDto userUpdatedRequestDto);
}
