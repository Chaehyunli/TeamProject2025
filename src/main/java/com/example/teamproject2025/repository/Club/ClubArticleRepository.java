package com.example.teamproject2025.repository.Club;

import com.example.teamproject2025.entity.Club.Article;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClubArticleRepository extends JpaRepository<Article, Long> {
    @Query("SELECT a FROM Article a WHERE a.club.clubId = :clubId AND a.articleId = :articleId")
    Optional<Article> findByClubIdAndArticleIdAndThumbUrl(@Param("clubId") Long clubId, @Param("articleId") Long articleId);

//    List<Article> findByClub_ClubId(Long clubId);

    @Query("SELECT a FROM Article a JOIN FETCH a.club WHERE a.club.clubId = :clubId")
    List<Article> findByClub_ClubId(@Param("clubId") Long clubId);

    boolean existsByClub_ClubId(Long clubId);

    @EntityGraph(attributePaths = "user")
    Optional<Article> findByArticleId(Long articleId);

    List<Article> findByUser_UserId(Long userId);

    @Modifying
    @Transactional
    void deleteAllByClub_ClubId(Long clubId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notice n WHERE n.user.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
