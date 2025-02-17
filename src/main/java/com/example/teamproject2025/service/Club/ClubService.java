package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ClubService {
    Long createClub(String username, String clubName, String description, String category, MultipartFile image) throws IOException;
    ClubListResponseDto getClubsByUserUniversity(String username, int limit, int offset);
}
