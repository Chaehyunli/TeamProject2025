package com.example.teamproject2025.repository.Club;

import com.example.teamproject2025.entity.Club.Article;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ClubArticleRepository extends JpaRepository<Article, Long> {
//    Optional<Article> findByClubIdAndArticleId(Long clubId, Long articleId);
    @Query("SELECT a FROM Article a WHERE a.club.clubId = :clubId AND a.articleId = :articleId")
    Optional<Article> findByClubIdAndArticleId(@Param("clubId") Long clubId, @Param("articleId") Long articleId);
}
