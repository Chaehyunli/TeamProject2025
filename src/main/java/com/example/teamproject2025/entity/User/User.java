package com.example.teamproject2025.entity.User;

import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // 사용자 고유 ID

    @Column(nullable = true)
    private Long universityId; // 소속 대학교 ID (nullable, foreign key)

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 사용자 아이디

    @Column(nullable = false, length = 255)
    private String password; // 비밀번호

    @Column(nullable = false, length = 100)
    private String name; // 사용자 이름

    @Column(nullable = false, unique = true, length = 20)
    private String studentId; // 학번 (eg. 60225153)

    @Column(nullable = false, unique = true, length = 100)
    private String email; // 이메일 주소

    private Boolean isEmailVerified = false; // 이메일 인증 여부
    private Boolean isUniVerified = false; // 학교 인증 여부

    @Column(nullable = false, length = 255)
    private String profileImage = "https://i.sstatic.net/l60Hf.png";

    @CreationTimestamp
    private LocalDateTime createdAt; // 계정 생성 시간 for users/register

    @UpdateTimestamp
    private LocalDateTime updatedAt; // 계정 업데이트 시간 for users/update

    @Column(nullable = true, length = 100)
    private String department; // 학과 (기본 null)

    // 기존의 update 메소드 수정
    public void update(UserUpdateRequestDto dto) {
        if (dto.getEmail() != null) this.email = dto.getEmail();
        if (dto.getIsEmailVerified() != null) this.isEmailVerified = dto.getIsEmailVerified();
        if (dto.getProfileImage() != null) this.profileImage = dto.getProfileImage();
        if (dto.getName() != null) this.name = dto.getName(); // ✅ 이름 업데이트 추가
        if (dto.getStudentId() != null) this.studentId = dto.getStudentId(); // ✅ 학번 업데이트 추가
        if (dto.getDepartment() != null) this.department = dto.getDepartment(); // ✅ 학과 업데이트 추가
        this.updatedAt = LocalDateTime.now();
    }

//    // update 메서드
//    public User update(UserUpdateRequestDto dto) {
//
//        return User.builder()
//                .userId(this.userId)
//                .username(this.username)
//                .password(this.password)
//                .name(this.name)
//                .studentId(this.studentId)
//                .universityId(this.universityId)
//                .email(dto.getEmail() != null ? dto.getEmail() : this.email) // 이메일 업데이트
//                .isEmailVerified(dto.getIsEmailVerified() != null ? dto.getIsEmailVerified() : this.isEmailVerified) // 인증 여부 업데이트
//                .profileImage(dto.getProfileImage() != null ? dto.getProfileImage() : this.profileImage) // 프로필 이미지 업데이트
//                .isUniVerified(this.isUniVerified)
//                .createdAt(this.createdAt)
//                .updatedAt(LocalDateTime.now())
//                .build();
//    }
    /*
     * ⚠️ Profile Update API 구현할 때 신경써야 할 부분이긴 한데,
     * 안전성을 위해 Email 입력란이 비어있게 되면 부분을 업데이트 진행하지 않는 형식으로 했다.
     * null 처리하면 Data Integrity 가 깨질거임
     * 추후 인증방식이 아니라, 회원가입 API 처럼 인증을 해야만 등록이 가능하도록 설정해야함
     * 지금 코드 비통합 단계라, 회원가입 API 에서 이 로직 처리 안되어있을건데, 처리 해야함
     */
}
