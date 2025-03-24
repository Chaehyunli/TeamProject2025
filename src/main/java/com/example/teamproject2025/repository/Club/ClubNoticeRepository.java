package com.example.teamproject2025.repository.Club;

import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Notice;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClubNoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT a FROM Notice a JOIN FETCH a.club WHERE a.club.clubId = :clubId")
    List<Notice> findByClub_ClubId(@Param("clubId") Long clubId);

    @EntityGraph(attributePaths = "user")
    Optional<Notice> findByNoticeId(Long noticeId);

    @Query("SELECT a FROM Notice a WHERE a.club.clubId = :clubId AND a.noticeId = :noticeId")
    Optional<Notice> findByClubIdAndNoticeIdAndThumbUrl(Long clubId, Long noticeId);
}
