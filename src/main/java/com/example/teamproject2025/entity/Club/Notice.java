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
    private Long noticeId;    // 공지사항 고유 id

    @Column(nullable = false)
    private String title;   // 공지사항 제목

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;  // 공지사항 작성할 동아리

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String contents; // 공지사항 본문

    @Column(columnDefinition = "TEXT", nullable = true)
    private String thumbUrl;  // 공지사항 사진 URL (선택 사항)

    @CreationTimestamp
    private LocalDateTime createdAt;    // 공지사항 작성 시간

    @UpdateTimestamp
    private LocalDateTime updatedAt;    // 공지사항 수정 시간

}