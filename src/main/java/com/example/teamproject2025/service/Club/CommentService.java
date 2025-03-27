package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.CommentResponseDto;
import com.example.teamproject2025.entity.User.User;

import java.util.List;

public interface CommentService {
    Long createComment(Long articleId, String content, Long userId, Long parentId);
    void updateComment(Long commentId, Long userId, String newContent);
    void deleteComment(Long commentId, Long userId);
    List<CommentResponseDto> getCommentsByArticle(Long articleId);

}
