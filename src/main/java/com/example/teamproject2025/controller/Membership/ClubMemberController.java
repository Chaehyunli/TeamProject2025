package com.example.teamproject2025.controller.Membership;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Membership.ClubMemberResponseDto;
import com.example.teamproject2025.service.Club.ClubService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clubs")
public class ClubMemberController {

    private final ClubService clubService;

    public ClubMemberController(ClubService clubService) {
        this.clubService = clubService;
    }

    // 동아리 멤버 목록 조회 API (회장, 부회장만 가능)
    @GetMapping("/{clubId}/members")
    public CommonResponseDto<List<ClubMemberResponseDto>> getClubMembers(
            @PathVariable Long clubId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 회장, 부회장 권한 확인
        if (!clubService.checkUserPermission(userId, clubId)) {
            return CommonResponseDto.error(403, "이 동아리의 멤버 목록을 조회할 권한이 없습니다.");
        }

        List<ClubMemberResponseDto> members = clubService.getClubMembers(clubId);

        return CommonResponseDto.success(200, "동아리 멤버 조회 성공", members);
    }
}

