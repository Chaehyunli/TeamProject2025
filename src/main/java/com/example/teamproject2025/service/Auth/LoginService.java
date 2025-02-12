package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.User.UserLoginRequestDto;
import com.example.teamproject2025.dto.User.UserLoginResponseDto;
import jakarta.servlet.http.HttpSession;

public interface LoginService {
    UserLoginResponseDto login(UserLoginRequestDto dto, HttpSession session);
}
