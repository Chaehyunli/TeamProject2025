package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.ClubSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClubSubmissionRepository extends JpaRepository<ClubSubmission, Long> {
    List<ClubSubmission> findByClub_ClubId(Long clubId);

    boolean existsByUser_UserIdAndClub_ClubId(Long userId, Long clubId);
}