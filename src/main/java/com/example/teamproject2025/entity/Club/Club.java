package com.example.teamproject2025.entity.Club;

import com.example.teamproject2025.entity.Membership.RoleType;
import com.example.teamproject2025.entity.Membership.UserClub;
import com.example.teamproject2025.entity.University.University;
import com.example.teamproject2025.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "clubs")
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clubId; // 동아리 고유 ID

    @Column(nullable = false, length = 100)
    private String clubName; // 동아리 이름

    @Lob
    @Column(nullable = false)
    private String description; // 동아리 설명

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // 카테고리 참조(foreign key), N:1 하나의 카테고리에 여러 동아리가 속할 수 있음

    @Column(length = 255)
    private String thumbUrl; // 동아리 사진 URL

    @ManyToOne
    @JoinColumn(name = "university_id", nullable = false)
    private University university; // 소속 대학교 참조(foreign key), N:1 하나의 대학교에 여러 동아리가 있을 수 있음

    @ManyToOne
    @JoinColumn(name = "president_id", nullable = false)
    private User president; // 동아리 회장 사용자 참조(foreign key), N:1한 사용자가 여러 개의 동아리 회장이 될 수 있음

    @CreationTimestamp
    private LocalDateTime createdAt; // 동아리 생성 시간 for /clubs

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserClub> userClubs; // UserClub 테이블과 N:1, 해당 동아리에 가입된 사용자 목록

    // 회장(PRESIDENT)과 부회장(VICE_PRESIDENT)만 필터링하여 반환
    public List<UserClub> getLeaders() {
        return userClubs.stream()
                .filter(uc -> uc.getRole().getRoleName().equals(RoleType.PRESIDENT) || uc.getRole().getRoleName().equals(RoleType.VICE_PRESIDENT))
                .collect(Collectors.toList());
    }
}