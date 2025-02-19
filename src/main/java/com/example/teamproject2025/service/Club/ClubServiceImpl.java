package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.ClubCreateRequestDto;
import com.example.teamproject2025.dto.Club.ClubListResponseDto;
import com.example.teamproject2025.dto.Membership.UserClubResponseDto;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    // 업로드 경로 (Spring Boot의 정적 리소스로 활용, 현재 프로젝트 루트 경로에 uploads 폴더 생성)
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/clubs/";

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
    public Long createClub(String username, String clubName, String description, String categoryName, MultipartFile thumbUrl) throws IOException {
        // 1. 현재 로그인한 사용자 찾기
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 카테고리 찾기
        Category category = categoryRepository.findByCategoryName(categoryName)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 카테고리입니다."));

        // 3. 사용자의 소속 대학교 찾기
        University university = universityRepository.findById(user.getUniversityId())
                .orElseThrow(() -> new IllegalArgumentException("대학교 정보를 찾을 수 없습니다."));

        // 4. 이미지 파일 저장 (파일이 존재할 경우만 처리)
        String storageThumbUrl = null;
        if (thumbUrl != null && !thumbUrl.isEmpty()) {
            File uploadFolder = new File(UPLOAD_DIR);
            if (!uploadFolder.exists() && !uploadFolder.mkdirs()) {
                throw new IOException("파일 업로드 디렉토리 생성 실패: " + UPLOAD_DIR);
            }

            // 저장할 파일명: 현재시간_파일명
            String fileName = System.currentTimeMillis() + "_" + thumbUrl.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);

            // 파일 저장
            thumbUrl.transferTo(filePath.toFile());

            // 클라이언트에서 접근할 수 있도록 URL 설정
            storageThumbUrl = "/uploads/clubs/" + fileName;
        }

        // 5. 동아리 엔티티 생성 후 저장
        ClubCreateRequestDto requestDto = new ClubCreateRequestDto(clubName, categoryName, description, university.getUniversityId(), storageThumbUrl, user.getUserId());
        Club newClub = requestDto.toEntity(category, university, user);
        clubRepository.save(newClub);

        // 6. 회장 역할 추가 (UserRole에 저장)
        UserRole presidentRole = UserRole.builder()
                .user(user)
                .club(newClub)
                .roleName(RoleType.PRESIDENT) // ENUM 사용
                .build();
        userRoleRepository.save(presidentRole);

        // 7. 회장을 `user_clubs`에 추가
        UserClub userClub = UserClub.builder()
                .user(user)
                .club(newClub)
                .role(presidentRole) // role 연결
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

    @Override
    @Transactional(readOnly = true)
    public String getUserRoleInClub(Long userId, Long clubId) {
        try {
            System.out.println("userId: " + userId + ", clubId: " + clubId);

            UserClub userClub = userClubRepository.findByUser_UserIdAndClub_ClubId(userId, clubId)
                    .orElseThrow(() -> new RuntimeException("해당 클럽에 속한 사용자가 아닙니다. userId: " + userId + ", clubId: " + clubId));

            System.out.println("조회된 userClub: " + userClub);

            return userClub.getRole().getRoleName().name(); // "PRESIDENT", "MEMBER" 등 반환
        } catch (Exception e) {
            System.err.println("클럽 내 역할 조회 실패: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserClubResponseDto> getUserClubs(Long userId) {
        List<UserClub> userClubs = userClubRepository.findByUser_UserId(userId);

        // 조회된 데이터 확인 (디버깅용)
        System.out.println("사용자의 동아리 수: " + userClubs.size());
        for (UserClub uc : userClubs) {
            System.out.println("클럽 ID: " + uc.getClub().getClubId() + ", 사용자 ID: " + uc.getUser().getUserId());
        }

        // UserClub → UserClubResponseDto 변환하여 반환
        return userClubs.stream()
                .map(UserClubResponseDto::fromEntity)
                .collect(Collectors.toList());
    }


}
