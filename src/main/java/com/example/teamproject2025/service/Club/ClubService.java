package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import com.example.teamproject2025.dto.Club.ClubResponseDto;
import com.example.teamproject2025.dto.Membership.UserClubResponseDto;

import java.io.IOException;
import java.util.List;

public interface ClubService {
    Long createClub(String username, String clubName, String description, String category, String uploadedFileName) throws IOException;
    ClubListResponseDto getClubsByUserUniversity(String username, int limit, int offset);

    String getUserRoleInClub(Long userId, Long clubId);

    List<UserClubResponseDto> getMyClubs(Long userId);
    ClubResponseDto getClub(Long clubId);
}
