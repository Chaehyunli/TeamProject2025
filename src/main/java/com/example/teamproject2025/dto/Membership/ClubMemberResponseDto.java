package com.example.teamproject2025.dto.Membership;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClubMemberResponseDto {
    private Long userId;
    private String name;
    private String roleName;
}

