package com.example.teamproject2025.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "university_id", foreignKey = @ForeignKey(name = "fk_users_university"), nullable = true)
    private University university;

    @Column(name = "username", unique= true, nullable = false, length = 50)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "student_id", unique = true, nullable = false, length = 20)
    private String studentId;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "is_email_verified", nullable = false)
    private boolean isEmailVerified = false;

    @Column(name = "is_uni_verified", nullable = false)
    private boolean isUniVerified = false;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 기본값을 설정하는 생성자 추가, JPA에서 null이 삽입될 수 있는 것을 방지
    @PrePersist
    protected void onCreate() {
        if (this.profileImage == null) {
            this.profileImage = "default_profile_url";
        }
    }
}