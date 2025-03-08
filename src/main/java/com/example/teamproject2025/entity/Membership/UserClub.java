package com.example.teamproject2025.entity.Membership;

import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_clubs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"club_id", "user_id"}) // 같은 클럽에 동일한 사용자가 중복 가입할 수 없음
})
public class UserClub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userClubId; // 기본 키 (자동 증가), 식별을 위해 추가함

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club; // 동아리 참조(foreign key), N:1 하나의 동아리에 여러 사용자가 가입 가능

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자 참조(foreign key), N:1 한 사용자가 여러 동아리에 가입 가능

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private UserRole role; // 사용자의 권한 참조(foreign key), N:1 한 권한에 여러 사용자가 있을 수 있음

    @CreationTimestamp
    private LocalDateTime joinedAt; // 동아리에 가입한 날짜
}