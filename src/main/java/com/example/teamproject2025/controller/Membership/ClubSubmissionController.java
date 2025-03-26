package com.example.teamproject2025.controller.Membership;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionRequestDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionResponseDto;
import com.example.teamproject2025.dto.Membership.GrantAuthorityRequestDto;
import com.example.teamproject2025.dto.Membership.LeaveClubRequestDto;
import com.example.teamproject2025.service.Club.ClubService;
import com.example.teamproject2025.service.Membership.ClubSubmissionService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/clubs")
public class ClubSubmissionController {

    private final ClubSubmissionService clubSubmissionService;
    private final ClubService clubService;

    public ClubSubmissionController(ClubSubmissionService clubSubmissionService, ClubService clubService) {
        this.clubSubmissionService = clubSubmissionService;
        this.clubService = clubService;
    }

    // 동아리 지원서 제출
    @PostMapping("/{clubId}/submissions")
    public CommonResponseDto<Long> submitApplication(
            @PathVariable Long clubId,
            @RequestBody @Valid ClubSubmissionRequestDto dto,
            HttpSession session) {

        // 세션에서 userId 가져오기
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 서비스 호출 (userId는 세션에서, clubId는 경로 변수에서 가져옴)
        Long submissionId = clubSubmissionService.submitApplication(userId, clubId, dto);

        return CommonResponseDto.success(200, "지원서 제출 성공", submissionId);
    }

    // 사용자의 동아리 지원 여부 조회
    @GetMapping("/{clubId}/submissions/status")
    public CommonResponseDto<Map<String, Boolean>> checkSubmissionStatus(
            @PathVariable Long clubId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        boolean hasApplied = clubSubmissionService.hasUserApplied(userId, clubId);
        return CommonResponseDto.success(200, "지원 여부 조회 성공", Map.of("hasApplied", hasApplied));
    }

    // 특정 동아리에 대한 지원서 목록 조회
    @GetMapping("/{clubId}/submissions")
    public CommonResponseDto<List<ClubSubmissionResponseDto>> getClubSubmissions(
            @PathVariable Long clubId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 해당 사용자의 동아리 내 역할 조회
        // String userRole = clubService.getUserRoleInClub(userId, clubId);

        // 회장(PRESIDENT) 또는 부회장(VICE_PRESIDENT)만 지원서 목록 조회 가능
        if (!clubService.checkUserPermission(userId, clubId)) {
            return CommonResponseDto.error(403, "이 동아리의 지원서 목록을 조회할 권한이 없습니다.");
        }

        List<ClubSubmissionResponseDto> submissions = clubSubmissionService.getSubmissionsByClub(clubId);
        return CommonResponseDto.success(200, "지원자 목록 조회 성공", submissions);
    }

    // 특정 지원서 조회 API
    @GetMapping("/{clubId}/submissions/{applyId}")
    public CommonResponseDto<ClubSubmissionResponseDto> getApplicationDetails(
            @PathVariable Long clubId,
            @PathVariable Long applyId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 사용자의 역할 가져오기
        // String userRole = clubService.getUserRoleInClub(userId, clubId);

        // PRESIDENT 또는 VICE_PRESIDENT가 아니라면 접근 제한
        if (!clubService.checkUserPermission(userId, clubId)) {
            return CommonResponseDto.error(403, "이 지원서를 조회할 권한이 없습니다.");
        }

        ClubSubmissionResponseDto submission = clubSubmissionService.getApplicationDetails(clubId, applyId);
        return CommonResponseDto.success(200, "지원서 조회 성공", submission);
    }

    // 특정 지원서 승인
    @PatchMapping("/{clubId}/submissions/{applyId}/approve")
    public CommonResponseDto<String> approveClubSubmission(
            @PathVariable Long clubId,
            @PathVariable Long applyId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 권한 체크 (회장 또는 부회장만 승인 가능)
        if (!clubService.checkUserPermission(userId, clubId)) {
            return CommonResponseDto.error(403, "이 지원서를 승인할 권한이 없습니다.");
        }

        // 지원서 승인 처리
        clubSubmissionService.approveSubmission(clubId, applyId);

        return CommonResponseDto.success(200, "지원서가 승인되었습니다.", null);
    }

    // 특정 지원서 거절
    @PatchMapping("/{clubId}/submissions/{applyId}/reject")
    public CommonResponseDto<String> rejectClubSubmission(
            @PathVariable Long clubId,
            @PathVariable Long applyId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 권한 체크 (회장 또는 부회장만 거절 가능)
        if (!clubService.checkUserPermission(userId, clubId)) {
            return CommonResponseDto.error(403, "이 지원서를 거절할 권한이 없습니다.");
        }

        // 지원서 거절 처리
        clubSubmissionService.rejectSubmission(clubId, applyId);

        return CommonResponseDto.success(200, "지원서가 거절되었습니다.", null);
    }

}
