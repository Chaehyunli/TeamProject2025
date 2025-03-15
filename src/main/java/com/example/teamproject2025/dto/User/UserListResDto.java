package com.example.teamproject2025.dto.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserListResDto {
    private Long userId;
    private String name;
    private String email;
}
