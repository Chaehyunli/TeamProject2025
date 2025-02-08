package com.example.teamproject2025.entity.User;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // 사용자 고유 ID

    @Column(nullable = true)
    private Integer universityId; // 소속 대학교 ID (nullable, foreign key)

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
    private String profileImage = "default_profile_url"; // 프로필 사진 URL

    @CreationTimestamp
    private LocalDateTime createdAt; // 계정 생성 시간 for users/register

    @UpdateTimestamp
    private LocalDateTime updatedAt; // 계정 업데이트 시간 for users/update


}

