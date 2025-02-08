package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserDetailResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;

public interface UserService {
    UserDetailResponseDto register(UserCreateRequestDto userCreateRequestDto);
    UserDetailResponseDto update(Long userId, UserUpdateRequestDto userUpdatedRequestDto);
}
