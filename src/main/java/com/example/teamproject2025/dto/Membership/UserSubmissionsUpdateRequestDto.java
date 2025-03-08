package com.example.teamproject2025.dto.Membership;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSubmissionsUpdateRequestDto {
    private String contact;      // 수정할 전화번호
    private String contents;     // 수정할 지원 동기
}
