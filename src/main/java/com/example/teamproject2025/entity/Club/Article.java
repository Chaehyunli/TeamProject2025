package com.example.teamproject2025.entity.Club;

import com.example.teamproject2025.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long articleId;    // 게시물 고유 id

    @Column(nullable = false)
    private String title;   // 게시물 제목

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;  // 게시물 작성할 동아리

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String contents; // 게시물 본문

    @Column(nullable = false)
    private boolean is_notice;  // 게시물인가 공지사항인가 구분

    @Column(nullable = true, columnDefinition = "TEXT")
    private String thumbUrl;  // 게시물 사진 URL (선택 사항)

//    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Article> articles;

    @CreationTimestamp
    private LocalDateTime createdAt;    // 게시물 작성 시간

    @UpdateTimestamp
    private LocalDateTime updatedAt;    // 게시물 수정 시간

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>(); // 댓글 필드 추가

}
