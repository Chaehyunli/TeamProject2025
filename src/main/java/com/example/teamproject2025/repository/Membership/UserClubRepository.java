package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.RoleType;
import com.example.teamproject2025.entity.Membership.UserClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserClubRepository extends JpaRepository<UserClub, Long> {
    Optional<UserClub> findByUser_UserIdAndClub_ClubId(Long userId, Long clubId);
    List<UserClub> findByUser_UserId(Long userId);
    @Query("SELECT uc FROM UserClub uc WHERE uc.club.clubId = :clubId AND uc.role.roleName IN (:president, :vicePresident)")
    List<UserClub> findLeadersByClubId(Long clubId, RoleType president, RoleType vicePresident);
    @Query("SELECT COUNT(uc) FROM UserClub uc WHERE uc.club.clubId = :clubId")
    int countByClubId(Long clubId);

    boolean existsByUser_UserIdAndClub_ClubId(Long userId, Long clubId);

    List<UserClub> findByClub_ClubId(Long clubId);

    Optional<UserClub> findByClub_ClubIdAndUser_UserId(Long clubId, Long targetUserId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserClub uc WHERE uc.club.clubId = :clubId")
    void deleteAllByClubId(@Param("clubId") Long clubId);
}
