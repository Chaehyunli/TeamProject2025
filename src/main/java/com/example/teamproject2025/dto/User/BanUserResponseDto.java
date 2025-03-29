package com.example.teamproject2025.dto.User;

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
    private Integer prevBadMessagesCnt;

    public BanUserResponseDto toEntity(
            User user,
            LocalDate allowedLoginDate,
            Integer prevBadMessagesCnt
    ){
        return BanUserResponseDto.builder()
                .user(user)
                .allowedLoginDate(allowedLoginDate)
                .prevBadMessagesCnt(prevBadMessagesCnt)
                .build();
    }
}

