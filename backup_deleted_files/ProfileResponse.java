package com.example.teamproject2025.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProfileResponse {
    private int status;

    private String message;

    private ProfileData data;
}