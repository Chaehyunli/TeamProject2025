package com.example.teamproject2025.controller.Membership;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Membership.ClubMemberResponseDto;
import com.example.teamproject2025.dto.Membership.GrantAuthorityRequestDto;
import com.example.teamproject2025.dto.Membership.LeaveClubRequestDto;
import com.example.teamproject2025.service.Club.ClubService;
import com.example.teamproject2025.service.Membership.ClubMemberService;
import com.example.teamproject2025.service.Membership.ClubSubmissionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clubs")
public class ClubMemberController {

    private final ClubService clubService;
    private final ClubMemberService clubMemberService;

    public ClubMemberController(ClubService clubService, ClubMemberService clubMemberService) {
        this.clubService = clubService;
        this.clubMemberService = clubMemberService;
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

        List<ClubMemberResponseDto> members = clubMemberService.getClubMembers(clubId);

        return CommonResponseDto.success(200, "동아리 멤버 조회 성공", members);
    }

    // 특정 회원에게 권한을 부여, 경로에서 user_id, club_id를 불러오지 않고 dto 사용
    @PostMapping("/grant-role")
    public CommonResponseDto<String> grantRole(
            @RequestBody GrantAuthorityRequestDto requestDto,
            HttpSession session){
        // 세션에서 현재 로그인한 사용자 ID 가져오기
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 현재 사용자가 회장인지
        if (!clubService.checkUserIsPresident(currentUserId, requestDto.getClubId())) {
            return CommonResponseDto.error(403, "권한을 부여할 권한이 없습니다.(회장만 가능)");
        }

        // 권한 부여 요청
        clubMemberService.grantAuthority(currentUserId, requestDto);

        return CommonResponseDto.success(200, "성공적으로 권한을 부여하였습니다.", null);
    }

    // 동아리에서 강퇴, 경로에서 user_id, club_id를 불러오지 않고 dto 사용
    @DeleteMapping("/leave-club")
    public CommonResponseDto<String> leaveClub(
            @RequestBody LeaveClubRequestDto requestDto,
            HttpSession session){
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 현재 사용자가 회장인지
        if (!clubService.checkUserIsPresident(currentUserId, requestDto.getClubId())) {
            return CommonResponseDto.error(403, "강퇴할 권한이 없습니다.(회장만 가능)");
        }

        // 강퇴 요청
        clubMemberService.leaveClub(currentUserId, requestDto);

        return CommonResponseDto.success(200, "성공적으로 동아리에서 강퇴하였습니다.", null);
    }
}

