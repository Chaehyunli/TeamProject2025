package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.entity.User.User;

public interface CommentService {
    Long createComment(Long articleId, String content, Long userId, Long parentId);
    void updateComment(Long commentId, Long userId, String newContent);
    void deleteComment(Long commentId, Long userId);
}
