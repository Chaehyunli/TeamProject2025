package com.example.teamproject2025.service.Membership;

import com.example.teamproject2025.dto.Membership.ClubSubmissionRequestDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionResponseDto;

import java.util.List;

public interface ClubSubmissionService {
    public Long submitApplication(Long userId, Long clubId, ClubSubmissionRequestDto dto);
    boolean hasUserApplied(Long userId, Long clubId);

    List<ClubSubmissionResponseDto> getApplicationsByClub(Long clubId);
    List<ClubSubmissionResponseDto> getApplicationsByUser(Long userId);
}
