package com.example.teamproject2025.repository.User;

import com.example.teamproject2025.entity.User.BanUser;
import com.example.teamproject2025.entity.User.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BanUserRepository extends JpaRepository<BanUser, Long> {
    Optional<BanUser> findByUser(User user);

    @Transactional // 데이터베이스 변경 작업이므로 트랜잭션 필요
    void deleteByUser(User user);
}
