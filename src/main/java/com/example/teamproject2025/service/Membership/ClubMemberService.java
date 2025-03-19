package com.example.teamproject2025.service.Membership;

import com.example.teamproject2025.dto.Membership.ClubMemberResponseDto;
import com.example.teamproject2025.dto.Membership.GrantAuthorityRequestDto;
import com.example.teamproject2025.dto.Membership.LeaveClubRequestDto;

import java.util.List;

public interface ClubMemberService {
    public void grantAuthority(Long grantorUserId, GrantAuthorityRequestDto requestDto);
    public void leaveClub(Long currentUserId, LeaveClubRequestDto requestDto);
    List<ClubMemberResponseDto> getClubMembers(Long clubId);
}
