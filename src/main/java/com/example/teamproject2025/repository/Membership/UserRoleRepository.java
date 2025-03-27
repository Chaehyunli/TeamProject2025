package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.RoleType;
import com.example.teamproject2025.entity.Membership.UserRole;
import com.example.teamproject2025.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByUser_UserIdAndClub_ClubId(Long targetUserId, Long clubId);

    List<UserRole> findByClub_ClubIdAndUser_UserId(Long clubId, Long targetUserId);

    int countByUserAndRoleName(User user, RoleType roleType);

    @Modifying
    @Transactional
    void deleteAllByClub_ClubId(Long clubId);

    @Modifying
    @Transactional
    void deleteAllByUser_UserId(Long userId);
}
