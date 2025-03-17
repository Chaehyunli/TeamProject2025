package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByUser_UserIdAndClub_ClubId(Long targetUserId, Long clubId);
}
