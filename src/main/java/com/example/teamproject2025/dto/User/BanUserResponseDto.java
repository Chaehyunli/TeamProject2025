package com.example.teamproject2025.dto.User;

import com.example.teamproject2025.entity.User.BanUser;
import com.example.teamproject2025.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BanUserResponseDto {
    private User user;
    private LocalDate allowedLoginDate;
    private int prevBadMessagesCnt;

    public static BanUser toEntity(
            User user,
            LocalDate allowedLoginDate,
            int prevBadMessagesCnt
    ){
        return BanUser.builder()
                .user(user)
                .allowedLoginDate(allowedLoginDate)
                .prevBadMessagesCnt(prevBadMessagesCnt)
                .build();
    }

    public static BanUserResponseDto toDTO(
        User user,
        LocalDate allowedLoginDate,
        int prevBadMessagesCnt
    ){
        return BanUserResponseDto.builder()
                .user(user)
                .allowedLoginDate(allowedLoginDate)
                .prevBadMessagesCnt(prevBadMessagesCnt)
                .build();
    }
}

