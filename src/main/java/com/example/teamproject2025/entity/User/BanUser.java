package com.example.teamproject2025.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class BanUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)  // 외래 키 설정
    private User user;

    @Column(nullable = false)
    private LocalDate allowedLoginDate;  // 제재 해제 일자

    @Column(nullable = false)
    private Integer prevBadMessagesCnt;  // 누적 비속어 메시지 수
}
