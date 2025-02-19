package com.example.teamproject2025.controller.Club;

import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.service.Club.ClubService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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

    @GetMapping("/{clubId}/role")
    public ResponseEntity<CommonResponseDto<Map<String, String>>> getUserRoleInClub(
            @PathVariable Long clubId,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("userId"); // 로그인한 사용자 ID 가져오기

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        try {
            String role = clubService.getUserRoleInClub(userId, clubId); // 특정 클럽에서의 역할 가져오기
            return ResponseEntity.ok(
                    CommonResponseDto.success(HttpStatus.OK.value(), "클럽 내 역할 조회 성공", Map.of("role", role))
            );
        } catch (RuntimeException e) {
            // 사용자가 해당 클럽에 속하지 않은 경우 예외 발생 시 NO_ROLE 반환
            return ResponseEntity.ok(
                    CommonResponseDto.success(HttpStatus.OK.value(), "사용자가 클럽에 속해있지 않습니다.", Map.of("role", "NO_ROLE"))
            );
        }
    }

    // 나의 동아리 목록 불러오기
    @GetMapping("/my-clubs")
    public ResponseEntity<CommonResponseDto<List<Club>>> getMyClubs(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        List<Club> myClubs = clubService.getMyClubs(userId);
        return ResponseEntity.ok(CommonResponseDto.success(HttpStatus.OK.value(), "내 동아리 목록 조회 성공", myClubs));
    }


}
