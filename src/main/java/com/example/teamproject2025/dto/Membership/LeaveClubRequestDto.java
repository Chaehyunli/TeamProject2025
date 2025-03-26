package com.example.teamproject2025.dto.Membership;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveClubRequestDto {
    private Long targetUserId;   // 강퇴할 사용자 ID
    private Long clubId;         // 동아리 ID
}
