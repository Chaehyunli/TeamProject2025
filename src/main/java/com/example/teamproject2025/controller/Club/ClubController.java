package com.example.teamproject2025.controller.Club;

import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.service.Club.ClubService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/clubs")
@RequiredArgsConstructor
public class ClubController {
    private final ClubService clubService;

    @PostMapping(consumes = "multipart/form-data") // multipart/form-data 사용
    public ResponseEntity<CommonResponseDto<Map<String, Long>>> createClub(
            HttpSession session, // 로그인한 사용자
            @RequestPart("clubName") String clubName,
            @RequestPart("description") String description,
            @RequestPart("category") String category,
            @RequestPart(value = "thumbUrl", required = false) MultipartFile thumbUrl // 파일 업로드
    ) throws IOException {
        String username = (String) session.getAttribute("username"); // 세션에서 사용자 확인
        Long clubId = clubService.createClub(username, clubName, description, category, thumbUrl);

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
