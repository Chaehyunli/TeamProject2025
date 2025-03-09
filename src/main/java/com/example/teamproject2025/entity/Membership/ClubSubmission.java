package com.example.teamproject2025.entity.Membership;

import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "club_submissions")
public class ClubSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applyId; // 지원서 ID

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 지원자 (FK)

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club; // 지원한 동아리 (FK)

    @Column(nullable = false, length = 20)
    private String studentId; // 학번

    @Column(nullable = false, length = 15)
    private String contact; // 전화번호

    @Column(nullable = false, length = 20)
    private String department; // 학과

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contents; // 지원 동기

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING'")
    private SubmissionStatus status = SubmissionStatus.PENDING; // 지원 상태 (기본값: PENDING)

    @CreationTimestamp
    private LocalDateTime createdAt; // 지원서 제출 시간

    @UpdateTimestamp
    private LocalDateTime updatedAt; // 지원서 마지막 수정 시간

    public enum SubmissionStatus {
        PENDING, APPROVED, REJECTED
    }
}
