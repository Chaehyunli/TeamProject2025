package com.example.teamproject2025.repository.Club;

import com.example.teamproject2025.entity.Club.Article;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClubArticleRepository extends JpaRepository<Article, Long> {
    @Query("SELECT a FROM Article a WHERE a.club.clubId = :clubId AND a.articleId = :articleId")
    Optional<Article> findByClubIdAndArticleId(@Param("clubId") Long clubId, @Param("articleId") Long articleId);

    List<Article> findByClub_ClubId(Long clubClubId);

    boolean existsByClub_ClubId(Long clubId);

    Optional<Article> findByArticleId(Long articleId);
}
