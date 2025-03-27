package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.ClubSubmission;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface ClubSubmissionRepository extends JpaRepository<ClubSubmission, Long> {
    List<ClubSubmission> findByClub_ClubId(Long clubId);

    boolean existsByUser_UserIdAndClub_ClubId(Long userId, Long clubId);

    Optional<ClubSubmission> findByClub_ClubIdAndApplyId(Long clubId, Long applyId);
    List<ClubSubmission> findByUser_UserId(Long userId);

    @Modifying
    @Transactional
    void deleteAllByClub_ClubId(Long clubId);

    @Modifying
    @Transactional
    void deleteAllByUser_UserId(Long userId);
}