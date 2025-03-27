package com.example.teamproject2025.entity.Club;

import com.example.teamproject2025.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noticeId;

    @Column(nullable = false)
    private String noticeContents;

    @Column(nullable = false)
    private String noticeTitle;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String thumbUrl;  // 게시물 사진 URL (선택 사항)

    @CreationTimestamp
    private LocalDateTime createdAt;    // 게시물 작성 시간

    @UpdateTimestamp
    private LocalDateTime updatedAt;    // 게시물 수정 시간

}