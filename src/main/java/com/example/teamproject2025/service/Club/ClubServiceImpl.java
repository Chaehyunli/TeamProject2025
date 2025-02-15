package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.ClubCreateRequestDto;
import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import com.example.teamproject2025.entity.Club.Category;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Membership.RoleType;
import com.example.teamproject2025.entity.Membership.UserClub;
import com.example.teamproject2025.entity.Membership.UserRole;
import com.example.teamproject2025.entity.University.University;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Club.CategoryRepository;
import com.example.teamproject2025.repository.Club.ClubRepository;
import com.example.teamproject2025.repository.Membership.UserClubRepository;
import com.example.teamproject2025.repository.Membership.UserRoleRepository;
import com.example.teamproject2025.repository.University.UniversityRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClubServiceImpl implements ClubService {
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UniversityRepository universityRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserClubRepository userClubRepository;

    public ClubServiceImpl(ClubRepository clubRepository, UserRepository userRepository,
                           CategoryRepository categoryRepository, UniversityRepository universityRepository,
                           UserRoleRepository userRoleRepository, UserClubRepository userClubRepository) {
        this.clubRepository = clubRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.universityRepository = universityRepository;
        this.userRoleRepository = userRoleRepository;
        this.userClubRepository = userClubRepository;
    }

    @Override
    @Transactional
    public Long createClub(String username, ClubCreateRequestDto requestDto) {
        // 1. 현재 로그인한 사용자 찾기
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 카테고리 찾기
        Category category = categoryRepository.findByCategoryName(requestDto.getCategory())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 카테고리입니다."));


        // 3. 사용자의 소속 대학교 찾기
        University university = universityRepository.findById(user.getUniversityId())
                .orElseThrow(() -> new IllegalArgumentException("대학교 정보를 찾을 수 없습니다."));

        // 4. 동아리 엔티티 생성 후 저장
        Club newClub = Club.builder()
                .clubName(requestDto.getClubName())
                .description(requestDto.getDescription())
                .category(category)
                .university(university)
                .president(user) // 동아리 회장 지정
                .thumbUrl(requestDto.getThumbUrl() != null ? requestDto.getThumbUrl() : "https://default-thumbnail.png")
                .build();

        clubRepository.save(newClub);

        // 5. 회장 역할 추가 (UserRole에 저장)
        UserRole presidentRole = UserRole.builder()
                .user(user)
                .club(newClub)
                .roleName(RoleType.PRESIDENT) // ENUM 사용
                .build();
        userRoleRepository.save(presidentRole);

        // 6. 회장을 `user_clubs`에 추가 **(이 부분이 기존에 없었음!)**
        UserClub userClub = UserClub.builder()
                .user(user)
                .club(newClub)
                .role(presidentRole) // 역할도 연결
                .build();
        userClubRepository.save(userClub); // user_clubs 테이블에 저장

        return newClub.getClubId();
    }

    @Override
    @Transactional(readOnly = true)
    public ClubListResponseDto getClubsByUserUniversity(String username, int limit, int offset) {
        // 1. 현재 로그인한 사용자 찾기
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 해당 사용자의 대학교 ID로 필터링하여 동아리 조회
        List<Club> clubs = clubRepository.findByUniversity_UniversityId(user.getUniversityId());

        // 전체 동아리 개수
        int total = clubs.size();

        // 3. 페이지네이션 적용
        List<Club> paginatedClubs = clubs.stream()
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());

        // 4. DTO 변환 후 반환
        return ClubListResponseDto.fromEntity(paginatedClubs, total, limit, offset);
    }
}
