package com.example.teamproject2025.dto.Membership;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrantAuthorityRequestDto {
    private Long targetUserId;   // 권한을 부여받을 사용자 ID
    private Long clubId;         // 동아리 ID
    private String role;         // 부여할 권한 (예: "VICE_PRESIDENT")
}
