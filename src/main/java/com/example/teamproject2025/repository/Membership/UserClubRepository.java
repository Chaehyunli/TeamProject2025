package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.UserClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserClubRepository extends JpaRepository<UserClub, Long> {
    Optional<UserClub> findByUser_UserIdAndClub_ClubId(Long userId, Long clubId);
    List<UserClub> findByUser_UserId(Long userId);

    boolean existsByUser_UserIdAndClub_ClubId(Long userId, Long clubId);

    List<UserClub> findByClub_ClubId(Long clubId);
}
