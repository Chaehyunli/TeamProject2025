package com.example.teamproject2025.service.Membership;

import com.example.teamproject2025.dto.Membership.ClubSubmissionRequestDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionResponseDto;
import com.example.teamproject2025.dto.Membership.UserSubmissionsUpdateRequestDto;
import com.example.teamproject2025.dto.Membership.UserSubmissionsUpdateResponseDto;

import java.util.List;

public interface ClubSubmissionService {
    public Long submitApplication(Long userId, Long clubId, ClubSubmissionRequestDto dto);
    boolean hasUserApplied(Long userId, Long clubId);
    List<ClubSubmissionResponseDto> getSubmissionsByClub(Long clubId);
    ClubSubmissionResponseDto getApplicationDetails(Long clubId, Long applyId);

    void approveSubmission(Long clubId, Long applyId);

    void rejectSubmission(Long clubId, Long applyId);
    List<ClubSubmissionResponseDto> getSubmissionsByUser(Long userId);
    ClubSubmissionResponseDto getSubmissionById(Long applyId);
    UserSubmissionsUpdateResponseDto updateSubmission(Long userId, Long applyId, UserSubmissionsUpdateRequestDto updateDto);
}
