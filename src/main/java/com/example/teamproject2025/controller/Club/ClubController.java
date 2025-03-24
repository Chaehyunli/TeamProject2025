package com.example.teamproject2025.controller.Club;

import com.example.teamproject2025.dto.Club.*;
import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.Membership.UserClubResponseDto;
import com.example.teamproject2025.service.Club.ClubService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

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
            @RequestPart(value = "thumbUrl", required = false) String thumbUrl // 파일 업로드
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
    public ResponseEntity<CommonResponseDto<List<UserClubResponseDto>>> getMyClubs(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        System.out.println("현재 로그인한 사용자 ID: " + userId);

        List<UserClubResponseDto> userMyClubs = clubService.getMyClubs(userId);

        System.out.println("조회된 동아리 개수: " + userMyClubs.size());

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "내 동아리 목록 조회 성공", userMyClubs)
        );
    }

    @GetMapping("/{clubId}")
    public ResponseEntity<CommonResponseDto<ClubResponseDto>> getClub(@PathVariable Long clubId) {
        ClubResponseDto club = clubService.getClub(clubId);
        return ResponseEntity.ok(
                CommonResponseDto.success(200, "Club details retrieved successfully", club)
        );
    }

    // 동아리 게시물 작성
    @PostMapping("/{clubId}/articles")
    public ResponseEntity<CommonResponseDto<ClubArticleResponseDto>> createArticle(
            @PathVariable Long clubId,
            HttpSession session,
            @RequestBody ClubArticleRequestDto requestDto
    ){
        Long userId = (Long) session.getAttribute("userId");

        ClubArticleResponseDto clubArticle = clubService.createArticle(
                clubId, userId, requestDto.getTitle(), requestDto.getContents(),
                requestDto.getThumbUrl(), requestDto.is_notice()
        );
        return ResponseEntity.ok(
                CommonResponseDto.success(200, "Article created successfully", clubArticle)
        );
    }

    // 동아리 게시물 목록 조회
    @GetMapping("/{clubId}/articles")
    public ResponseEntity<CommonResponseDto<ArticleListResponseDto>> getClubArticlesList(
            @PathVariable Long clubId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int offset
    ){
        ArticleListResponseDto articleList = clubService.getArticlesList(clubId, limit, offset);

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "Article list retrieved successfully", articleList)
        );
    }

    // 동아리 게시물 삭제
    @DeleteMapping("/{clubId}/articles/{articleId}")
    public CommonResponseDto<String> deleteArticle(
            @PathVariable Long clubId,
            @PathVariable Long articleId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401,"로그인이 필요합니다.");
        }

        boolean isDelete = clubService.deleteArticle(clubId, articleId, userId);
        if (!isDelete) {
            return CommonResponseDto.error(403, "해당 게시물 삭제할 권한이 없습니다.");
        }

        return CommonResponseDto.success(200, "게시물이 성공적으로 삭제되었습니다.", null);
    }

    // 동아리 게시물 수정
    @PutMapping("/{clubId}/articles/{articleId}")
    public ResponseEntity<CommonResponseDto<ClubArticleResponseDto>> updateArticle(
            HttpSession session,
            @PathVariable Long clubId,
            @PathVariable Long articleId,
            @RequestBody ArticleModificationRequestDto requestDto
    ){

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new NoSuchElementException("가입되지 않은 회원입니다.");
        }

        ClubArticleResponseDto modification = clubService.updateArticle(userId, clubId, articleId, requestDto);

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "게시물 수정을 성공적으로 했습니다.", modification)
        );
    }

    // 동아리 특정 게시물 조회
    @GetMapping("/{clubId}/articles/{articleId}")
    public ResponseEntity<CommonResponseDto<SpecificArticleResponseDto>> getArticleDetail(
            @PathVariable Long clubId,
            @PathVariable Long articleId
    ){

        SpecificArticleResponseDto article = clubService.getArticleDetail(clubId, articleId);

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "특정 게시물을 성공적으로 조회습니다.", article)
        );

    }

    // 동아리 공지사항 작성
    @PostMapping("/{clubId}/notices")
    public ResponseEntity<CommonResponseDto<NoticeCreateResponseDto>> createNotice(
            @PathVariable Long clubId,
            @RequestBody NoticeCreateRequestDto requestDto,
            HttpSession session
    ){
        Long userId = (Long) session.getAttribute("userId");

        NoticeCreateResponseDto clubNotice = clubService.createNotice(
                clubId, userId, requestDto
        );

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "Notice created successfully", clubNotice)
        );
    }

    // 동아리 공지사항 조회
    @GetMapping("/{clubId}/notices")
    public ResponseEntity<CommonResponseDto<NoticeListResponseDto>> NoticeList(
            @PathVariable Long clubId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int offset
    ) {
        NoticeListResponseDto noticeList = clubService.getNoticeList(clubId, limit, offset);

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "Notice list retrieved successfully", noticeList)
        );
    }

    // 동아리 공지사항 삭제
    @DeleteMapping("/{clubId}/notices/{noticeId}")
    public CommonResponseDto<String> deleteNotice(
            @PathVariable Long clubId,
            @PathVariable Long noticeId,
            HttpSession session
    ){
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return CommonResponseDto.error(401, "로그인이 필요합니다.");
        }

        boolean isDelete = clubService.deleteNotice(clubId, noticeId, userId);

        if (!isDelete) {
            return CommonResponseDto.error(403, "해당 게시물 삭제할 권한이 없습니다.");
        }

        return CommonResponseDto.success(200, "공지사항을 성공적으로 삭제했습니다.", null);
    }

    // 동아리 공지사항 수정
    @PutMapping("/{clubId}/notices/{noticeId}")
    public ResponseEntity<CommonResponseDto<NoticeCreateResponseDto>> updateNotice(
            @PathVariable Long clubId,
            @PathVariable Long noticeId,
            HttpSession session,
            @RequestBody NoticeCreateRequestDto requestDto
    ){
        Long userId = (Long) session.getAttribute("userId");

        NoticeCreateResponseDto modification = clubService.updateNotice(userId, clubId, noticeId, requestDto);

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "공지사항 수정을 성공적으로 했습니다.", modification)
        );
    }

    @GetMapping("/{clubId}/notices/{noticeId}")
    public ResponseEntity<CommonResponseDto<SpecificNoticeResponseDto>> getNoticeDetail(
            @PathVariable Long clubId,
            @PathVariable Long noticeId,
    ){

        SpecificNoticeResponseDto notice = clubService.getNoticeDetail(clubId, noticeId);

        return ResponseEntity.ok(
                CommonResponseDto.success(200, "특정 게시물을 성공적으로 조회습니다.", notice)
        );
    }

}
