package com.example.teamproject2025.repository.User;

import com.example.teamproject2025.entity.User.BanUser;
import com.example.teamproject2025.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BanUserRepository extends JpaRepository<BanUser, Long> {
    Optional<BanUser> findByUser(User user);
}
