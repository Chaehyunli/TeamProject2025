package com.example.teamproject2025.entity.Membership;

import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.User.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_roles", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"club_id", "user_id"}) // 같은 동아리에서 중복 권한 방지
})
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId; // 권한 고유 ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType roleName; // 권한 이름, Enum 사용

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club; // 관련 동아리 참조(foreign key), N:1 하나의 동아리에서 여러 사용자가 각각 다른 권한을 가질 수 있음

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 권한을 부여 받은 사용자 참조(foreign key), N:1 하나의 사용자가 여러 동아리에서 role이 있음
}
