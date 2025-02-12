package com.example.teamproject2025.service.EmailAuth;

import com.example.teamproject2025.dto.EmailAuth.EmailResponseDto;

public interface EmailService {
    public void sendEmail(String to, String subject, String text);
    public EmailResponseDto verifyEmail(String email, String verificationCode);
}
