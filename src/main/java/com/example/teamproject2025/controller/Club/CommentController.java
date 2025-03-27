package com.example.teamproject2025.controller.Club;

import com.example.teamproject2025.dto.Club.CommentRequestDto;
import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.entity.Club.Comment;
import com.example.teamproject2025.service.Club.CommentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 작성 API
    @PostMapping("/articles/{articleId}")
    public ResponseEntity<CommonResponseDto<Map<String, Long>>> createComment(
            @PathVariable Long articleId,
            @RequestBody CommentRequestDto requestDto,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body(CommonResponseDto.error(401, "로그인이 필요합니다."));
        }

        Long commentId = commentService.createComment(articleId, requestDto.getContent(), userId, requestDto.getParentId());

        return ResponseEntity.ok(CommonResponseDto.success(200, "댓글 ID " + commentId + "번 등록 성공", Map.of("commentId", commentId)));
    }

    // 댓글 수정 API
    @PatchMapping("/articles/{commentId}")
    public ResponseEntity<CommonResponseDto<Void>> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequestDto requestDto,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(CommonResponseDto.error(401, "로그인이 필요합니다."));
        }

        try {
            commentService.updateComment(commentId, userId, requestDto.getContent());
            return ResponseEntity.ok(CommonResponseDto.success(200, "댓글이 성공적으로 수정되었습니다."));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(CommonResponseDto.error(403, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(CommonResponseDto.error(404, e.getMessage()));
        }
    }

    // 댓글 삭제 API(실제 삭제 x, 논리적 삭제만)
    @DeleteMapping("/articles/{commentId}")
    public ResponseEntity<CommonResponseDto<Void>> deleteComment(
            @PathVariable Long commentId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(CommonResponseDto.error(401, "로그인이 필요합니다."));
        }

        try {
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(CommonResponseDto.success(200, "댓글이 성공적으로 삭제되었습니다."));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(CommonResponseDto.error(403, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(CommonResponseDto.error(404, e.getMessage()));
        }
    }

}

