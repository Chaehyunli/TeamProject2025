package com.example.teamproject2025.controller.Club;

import com.example.teamproject2025.dto.Club.ClubCreateRequestDto;
import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.service.Club.ClubService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/clubs")
@RequiredArgsConstructor
public class ClubController {
    private final ClubService clubService;

    @PostMapping
    public ResponseEntity<CommonResponseDto<Map<String, Long>>> createClub(
            HttpSession session, // 로그인한 사용자
            @RequestBody ClubCreateRequestDto requestDto
    ) {
        String username = (String) session.getAttribute("username"); // 세션에서 username 가져오기
        Long clubId = clubService.createClub(username, requestDto);

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "Create a Club Successfully", Map.of("club_id", clubId))
        );
    }

    @GetMapping
    public ResponseEntity<CommonResponseDto<ClubListResponseDto>> getClubs(
            HttpSession session, // 로그인한 사용자
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int offset
    ) {
        String username = (String) session.getAttribute("username");
        ClubListResponseDto clubList = clubService.getClubsByUserUniversity(username, limit, offset);

        return ResponseEntity.ok(CommonResponseDto.success(200, "Club list retrieved successfully", clubList));}
}
