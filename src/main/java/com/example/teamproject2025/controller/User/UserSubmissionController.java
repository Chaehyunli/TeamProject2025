package com.example.teamproject2025.controller.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionResponseDto;
import com.example.teamproject2025.dto.Membership.UserSubmissionsUpdateRequestDto;
import com.example.teamproject2025.dto.Membership.UserSubmissionsUpdateResponseDto;
import com.example.teamproject2025.service.Membership.ClubSubmissionService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserSubmissionController {

    private final ClubSubmissionService clubSubmissionService;

    public UserSubmissionController(ClubSubmissionService clubSubmissionService) {
        this.clubSubmissionService = clubSubmissionService;
    }

    // 사용자의 지원서 목록 조회
    @GetMapping("/submissions")
    public CommonResponseDto<List<ClubSubmissionResponseDto>> getUserSubmissions(HttpSession session) {
        // 세션에서 userId 가져오기
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        List<ClubSubmissionResponseDto> submissions = clubSubmissionService.getSubmissionsByUser(userId);
        return CommonResponseDto.success(200, "사용자의 지원서 목록 조회 성공", submissions);
    }

    // 사용자의 지원서 상세 정보 조회
    @GetMapping("/submissions/{applyId}")
    public CommonResponseDto<ClubSubmissionResponseDto> getUserSubmissionDetail(@PathVariable Long applyId, HttpSession session) {
        // 세션에서 userId 가져오기
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 해당 지원서가 본인의 지원서인지 확인
        ClubSubmissionResponseDto submission = clubSubmissionService.getSubmissionById(applyId);
        if (submission == null || !submission.getUserId().equals(userId)) {
            return CommonResponseDto.error(403, "해당 지원서를 조회할 권한이 없습니다.");
        }
        return CommonResponseDto.success(200, "사용자의 지원서 상세정보 조회 성공", submission);

    }

    // 내 지원서 수정 API
    @PatchMapping("/submissions/{applyId}")
    public CommonResponseDto<UserSubmissionsUpdateResponseDto> updateUserSubmission(
            @PathVariable Long applyId,
            @RequestBody @Valid UserSubmissionsUpdateRequestDto updateDto,
            HttpSession session) {

        // 로그인 확인
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 서비스 호출 (지원서 수정)
        UserSubmissionsUpdateResponseDto updatedSubmission = clubSubmissionService.updateSubmission(userId, applyId, updateDto);
        if (updatedSubmission == null) {
            return CommonResponseDto.error(403, "해당 지원서를 수정할 권한이 없습니다.");
        }

        return CommonResponseDto.success(200, "지원서 수정 성공", updatedSubmission);
    }

    // 내 지원서 삭제 API
    @DeleteMapping("/submissions/{applyId}")
    public CommonResponseDto<String> deleteUserSubmission(@PathVariable Long applyId, HttpSession session) {
        // 로그인 확인
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        // 서비스 호출 (지원서 삭제)
        boolean isDeleted = clubSubmissionService.deleteSubmission(userId, applyId);
        if (!isDeleted) {
            return CommonResponseDto.error(403, "해당 지원서를 삭제할 권한이 없습니다.");
        }

        return CommonResponseDto.success(200, "지원서가 성공적으로 삭제되었습니다.", null);
    }

}
