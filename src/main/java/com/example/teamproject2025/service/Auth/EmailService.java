package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.Auth.EmailResponseDto;


public interface EmailService {
    public void sendVerificationEmail(String email);
    public void sendEmail(String to, String subject, String text);
    public EmailResponseDto verifyEmail(String email, String verificationCode);
}
