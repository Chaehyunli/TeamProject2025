package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.Auth.EmailResponseDto;
import com.example.teamproject2025.dto.Auth.FindUserIdResponseDto;
import com.example.teamproject2025.dto.Auth.ResetUserPasswordRequestDto;

public interface FindUserAuthService {
    FindUserIdResponseDto findUserId(EmailResponseDto dto);
    public void resetUserPassword(ResetUserPasswordRequestDto dto);
}
