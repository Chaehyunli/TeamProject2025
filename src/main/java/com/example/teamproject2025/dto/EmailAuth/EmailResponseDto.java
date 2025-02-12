package com.example.teamproject2025.dto.EmailAuth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponseDto {
    private String email;
    private Boolean isEmailVerified;
}
