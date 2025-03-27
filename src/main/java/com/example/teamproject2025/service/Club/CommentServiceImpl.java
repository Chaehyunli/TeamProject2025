package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Comment;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Club.ClubArticleRepository;
import com.example.teamproject2025.repository.Club.CommentRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ClubArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Override
    public Long createComment(Long articleId, String content, Long userId, Long parentId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Comment parent = null;

        // 대댓글일 경우 parentId 확인
        if (parentId != null) {
            parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글을 찾을 수 없습니다."));

            if (parent.getParent() != null) {
                throw new IllegalArgumentException("대댓글의 대댓글은 허용되지 않습니다.");
            }
        }

        Comment comment = Comment.builder()
                .content(content)
                .author(user)
                .createdAt(LocalDateTime.now())
                .article(article)
                .parent(parent)
                .build();

        return commentRepository.save(comment).getCommentId();
    }
}

