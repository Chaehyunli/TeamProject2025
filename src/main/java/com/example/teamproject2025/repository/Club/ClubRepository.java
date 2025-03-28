package com.example.teamproject2025.repository.Club;

import com.example.teamproject2025.entity.Club.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    // 동아리 이름으로 찾기 (중복 체크용)
    Optional<Club> findByClubName(String clubName);
    // 특정 카테고리에 속한 동아리 목록 (사용자의 대학교에 속한 것만)
    List<Club> findByCategory_CategoryIdAndUniversity_UniversityId(Long categoryId, Long universityId);
    // 현재 로그인한 사용자의 대학교에 속한 동아리 목록만 조회
    @Query("SELECT c FROM Club c WHERE c.university.universityId = :universityId")
    List<Club> findByUniversity_UniversityId(@Param("universityId") Long universityId);
    // 동아리 썸네일 가져오기
    @Query("SELECT c FROM Club c WHERE c.clubId = :clubId")
    Optional<Club> findByIdWithThumbUrl(@Param("clubId") Long clubId);

    List<Club> findByUniversity_UniversityIdAndClubNameContaining(Long universityId, String search);

    boolean existsByPresident_UserId(Long userId);
}