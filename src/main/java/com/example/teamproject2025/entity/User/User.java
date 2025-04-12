package com.example.teamproject2025.entity.User;

import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import com.example.teamproject2025.entity.Membership.UserClub;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "users_email_unique", columnNames = "email"),
        @UniqueConstraint(name = "users_username_unique", columnNames = "username"),
        @UniqueConstraint(name = "users_studentId_unique", columnNames = "student_id")
})
// 단일 컬럼의 unique=true 를 없애면 될 것 같아요.
// 이건 Exception Handler 에서 식별하려면 저 name 이 필요합니다. 저것도 똑같이 unique 거는거니까 상관없어요.
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // 사용자 고유 ID

    @Column(nullable = true)
    private Long universityId; // 소속 대학교 ID (nullable, foreign key)

    @Column(nullable = false, length = 50)
    private String username; // 사용자 아이디

    @Column(nullable = false, length = 255)
    private String password; // 비밀번호

    @Column(nullable = false, length = 100)
    private String name; // 사용자 이름

    @Column(nullable = false, length = 20)
    private String studentId; // 학번 (eg. 60225153)

    @Column(nullable = true, length = 255)
    private String department; // 전공 학과 (nullable)

    @Column(nullable = false, length = 100)
    private String email; // 이메일 주소

    private Boolean isEmailVerified ; // 이메일 인증 여부

    @Column(nullable = false, columnDefinition = "TEXT")
    private String profileImage;

    @CreationTimestamp
    private LocalDateTime createdAt; // 계정 생성 시간 for users/register

    @UpdateTimestamp
    private LocalDateTime updatedAt; // 계정 업데이트 시간 for users/update

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserClub> userClubs; // 사용자가 가입한 동아리 리스트

    // 기존 객체 수정 방식만 유지
    public void update(UserUpdateRequestDto dto) {
        if (dto.getEmail() != null) this.email = dto.getEmail();
        if (dto.getIsEmailVerified() != null) this.isEmailVerified = dto.getIsEmailVerified();
        if (dto.getProfileImage() != null) this.profileImage = dto.getProfileImage();
        if (dto.getName() != null) this.name = dto.getName();
        if (dto.getStudentId() != null) this.studentId = dto.getStudentId();
        if (dto.getDepartment() != null) this.department = dto.getDepartment();
        this.updatedAt = LocalDateTime.now();
    }

    // 기존 객체 수정 (새로운 객체 생성 X)
    public void updatePassword(String newEncodedPassword) {
        this.password = newEncodedPassword;
        this.updatedAt = LocalDateTime.now(); // updated_at 갱신
    }
}