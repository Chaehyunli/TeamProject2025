package com.example.teamproject2025.controller.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionResponseDto;
import com.example.teamproject2025.service.Membership.ClubSubmissionService;
import jakarta.servlet.http.HttpSession;
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
}
