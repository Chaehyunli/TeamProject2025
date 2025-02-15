package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.ClubCreateRequestDto;
import com.example.teamproject2025.dto.Club.ClubListResponseDto;

public interface ClubService {
    Long createClub(String username, ClubCreateRequestDto requestDto);
    ClubListResponseDto getClubsByUserUniversity(String username, int limit, int offset);
}
