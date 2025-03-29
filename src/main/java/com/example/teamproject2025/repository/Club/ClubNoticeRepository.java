package com.example.teamproject2025.repository.Club;

import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Notice;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

public interface ClubNoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT a FROM Notice a JOIN FETCH a.club WHERE a.club.clubId = :clubId")
    List<Notice> findByClub_ClubId(@Param("clubId") Long clubId);

    @EntityGraph(attributePaths = "user")
    Optional<Notice> findByNoticeId(Long noticeId);

    List<Notice> findByUser_UserId(Long userId);

    boolean existsByClub_ClubId(Long clubId);

    @Query("SELECT a FROM Notice a WHERE a.club.clubId = :clubId AND a.noticeId = :noticeId")
    Optional<Notice> findByClubIdAndNoticeIdAndThumbUrl(Long clubId, Long noticeId);


    @Modifying
    @Transactional
    void deleteAllByClub_ClubId(Long clubId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Article a WHERE a.user.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
