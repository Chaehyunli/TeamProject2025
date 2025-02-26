package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import com.example.teamproject2025.dto.Membership.ClubMemberResponseDto;
import com.example.teamproject2025.dto.Membership.UserClubResponseDto;
import com.example.teamproject2025.entity.Club.Club;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ClubService {
    Long createClub(String username, String clubName, String description, String category, MultipartFile image) throws IOException;
    ClubListResponseDto getClubsByUserUniversity(String username, int limit, int offset);

    String getUserRoleInClub(Long userId, Long clubId);

    List<UserClubResponseDto> getMyClubs(Long userId);

    boolean checkUserPermission(Long userId, Long clubId);

    List<ClubMemberResponseDto> getClubMembers(Long clubId);
}
