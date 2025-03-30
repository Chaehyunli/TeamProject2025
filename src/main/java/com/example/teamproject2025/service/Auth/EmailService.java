package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.Auth.EmailResponseDto;


public interface EmailService {
    public void sendVerificationEmail(String email, String univName);
    public void sendEmail(String to, String subject, String verificationCode);
    public EmailResponseDto verifyEmail(String email, String verificationCode);
    String getUniversityNameByEmail(String email);
}
