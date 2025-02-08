package com.example.teamproject2025.dto.User;


import com.example.teamproject2025.entity.User.User;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequestDto {
    private String email;
    private Boolean isEmailVerified; // email 변경하면 재인증 해야 함.
    private String profileImage;

    // ⭐️ 이미 존재하는 Entity 가 있으니, 이를 활용하는 방식으로 가자 -> User Entity 내부에 정의한다.
//    public User toEntity() {
//        return User.builder()
//                .email(email)
//                .isEmailVerified(isEmailVerified)
//                .profileImage(profileImage)
//                .build();
//    }
}