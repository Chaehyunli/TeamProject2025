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
    private Long id;
    private User user;
    private LocalDate allowedLoginDate;
    private int prevBadMessagesCnt;

    public static BanUser toEntity(
            Long id,
            User user,
            LocalDate allowedLoginDate,
            int prevBadMessagesCnt
    ){
        return BanUser.builder()
                .id(id)
                .user(user)
                .allowedLoginDate(allowedLoginDate)
                .prevBadMessagesCnt(prevBadMessagesCnt)
                .build();
    }

    public static BanUserResponseDto toDTO(
        Long id,
        LocalDate allowedLoginDate,
        int prevBadMessagesCnt
    ){
        return BanUserResponseDto.builder()
                .id(id)
                .allowedLoginDate(allowedLoginDate)
                .prevBadMessagesCnt(prevBadMessagesCnt)
                .build();
    }
}

