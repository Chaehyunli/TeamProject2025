package com.example.teamproject2025.controller.Membership;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionRequestDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionResponseDto;
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

    public ClubSubmissionController(ClubSubmissionService clubSubmissionService) {
        this.clubSubmissionService = clubSubmissionService;
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

        List<ClubSubmissionResponseDto> submissions = clubSubmissionService.getSubmissionsByClub(clubId);
        return CommonResponseDto.success(200, "지원자 목록 조회 성공", submissions);
    }


}
