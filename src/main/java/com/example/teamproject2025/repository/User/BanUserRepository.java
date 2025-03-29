package com.example.teamproject2025.repository.User;

import com.example.teamproject2025.entity.User.BanUser;
import com.example.teamproject2025.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BanUserRepository extends JpaRepository<BanUser, Long> {
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.user = :user AND m.isBadWord = true")
    Integer countBadMessagesByUser(@Param("user") User user);
}
