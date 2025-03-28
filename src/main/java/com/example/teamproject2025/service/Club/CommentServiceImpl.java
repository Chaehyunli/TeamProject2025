package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.CommentResponseDto;
import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Comment;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Club.ClubArticleRepository;
import com.example.teamproject2025.repository.Club.CommentRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ClubArticleRepository articleRepository;
    private final UserRepository userRepository;

    // 댓글 작성
    @Override
    @Transactional
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

    // 댓글 수정
    @Override
    @Transactional
    public void updateComment(Long commentId, Long userId, String newContent) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getUserId().equals(userId)) {
            throw new SecurityException("작성자 본인만 댓글을 수정할 수 있습니다.");
        }

        comment.setContent(newContent);
        comment.setUpdatedAt(LocalDateTime.now());

        commentRepository.save(comment); // 생략 가능
    }

    // 댓글 삭제(실제 삭제x, 논리적 삭제만)
    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        User requestUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 댓글의 작성자
        User author = comment.getAuthor();

        // 댓글 → 게시글 → 동아리 → 회장
        User president = comment.getArticle().getClub().getPresident();

        // 삭제 권한 확인
        if (!requestUser.equals(author) && !requestUser.equals(president)) {
            throw new SecurityException("댓글 삭제 권한이 없습니다.");
        }

        // 논리적 삭제 처리
        comment.setDeleted(true);
        comment.setContent("삭제된 댓글입니다");
        comment.setUpdatedAt(LocalDateTime.now());
    }

    // 댓글 조회
    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getCommentsByArticle(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));

        List<Comment> allComments = commentRepository.findByArticle(article);

        // 루트 댓글만 필터링 (parent == null)
        List<Comment> rootComments = allComments.stream()
                .filter(c -> c.getParent() == null)
                .toList();

        // 트리로 변환
        return rootComments.stream()
                .map(this::convertToDtoTree)
                .toList();
    }

    private CommentResponseDto convertToDtoTree(Comment comment) {
        String content = comment.isDeleted() ? "삭제된 댓글입니다" : comment.getContent();

        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .content(content)
                .userId(comment.getAuthor().getUserId()) // ← 닉네임 안 넘김!
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .deleted(comment.isDeleted())
                .children(comment.getChildren().stream()
                        .map(this::convertToDtoTree)
                        .toList()
                )
                .build();
    }

}

