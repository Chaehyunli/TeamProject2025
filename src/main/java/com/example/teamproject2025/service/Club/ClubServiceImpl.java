package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.*;
import com.example.teamproject2025.dto.Membership.ClubMemberResponseDto;
import com.example.teamproject2025.dto.Membership.UserClubResponseDto;
import com.example.teamproject2025.entity.Club.Article;
import com.example.teamproject2025.entity.Club.Category;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Membership.RoleType;
import com.example.teamproject2025.entity.Membership.UserClub;
import com.example.teamproject2025.entity.Membership.UserRole;
import com.example.teamproject2025.entity.University.University;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Club.CategoryRepository;
import com.example.teamproject2025.repository.Club.ClubArticleRepository;
import com.example.teamproject2025.repository.Club.ClubRepository;
import com.example.teamproject2025.repository.Membership.ClubSubmissionRepository;
import com.example.teamproject2025.repository.Membership.UserClubRepository;
import com.example.teamproject2025.repository.Membership.UserRoleRepository;
import com.example.teamproject2025.repository.University.UniversityRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClubServiceImpl implements ClubService {
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final UniversityRepository universityRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserClubRepository userClubRepository;
    private final ClubArticleRepository clubArticleRepository;


    @Autowired
    private ApplicationContext applicationContext;

    // 업로드 경로 (Spring Boot의 정적 리소스로 활용, 현재 프로젝트 루트 경로에 uploads 폴더 생성)
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/clubs/";
    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    public ClubServiceImpl(ClubRepository clubRepository, UserRepository userRepository,
                           CategoryRepository categoryRepository, UniversityRepository universityRepository,
                           UserRoleRepository userRoleRepository, UserClubRepository userClubRepository,
                           Storage storage, ClubSubmissionRepository clubSubmissionRepository, ClubArticleRepository clubArticleRepository) {
        this.clubRepository = clubRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.universityRepository = universityRepository;
        this.userRoleRepository = userRoleRepository;
        this.userClubRepository = userClubRepository;
        this.clubArticleRepository = clubArticleRepository;
    }

    @Override
    @Transactional
    public Long createClub(String username, String clubName, String description, String categoryName, String uploadedFileName) throws IOException {
        // 1. 현재 로그인한 사용자 찾기
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 카테고리 찾기
        Category category = categoryRepository.findByCategoryName(categoryName)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 카테고리입니다."));

        // 3. 사용자의 소속 대학교 찾기
        University university = universityRepository.findById(user.getUniversityId())
                .orElseThrow(() -> new IllegalArgumentException("대학교 정보를 찾을 수 없습니다."));

        // 4. 파일명이 없으면 기본 썸네일 이미지 사용
        String storageThumbUrl = (uploadedFileName != null && !uploadedFileName.isEmpty())
                ? uploadedFileName
                : "default-thumbnail.png"; // 기본 이미지

        // 5. 동아리 엔티티 생성 후 저장
        ClubCreateRequestDto requestDto = new ClubCreateRequestDto(clubName, categoryName, description,
                university.getUniversityId(), storageThumbUrl, user.getUserId());
        Club newClub = requestDto.toEntity(category, university, user);
        clubRepository.save(newClub);

        // 6. 회장 역할 추가 (UserRole에 저장)
        UserRole presidentRole = UserRole.builder()
                .user(user)
                .club(newClub)
                .roleName(RoleType.PRESIDENT)
                .build();
        userRoleRepository.save(presidentRole);

        // 7. 회장을 `user_clubs`에 추가
        UserClub userClub = UserClub.builder()
                .user(user)
                .club(newClub)
                .role(presidentRole)
                .build();
        userClubRepository.save(userClub);

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
    public List<UserClubResponseDto> getMyClubs(Long userId) {
        List<UserClub> myClubs = userClubRepository.findByUser_UserId(userId);

        // 조회된 데이터 확인 (디버깅용)
        System.out.println("사용자의 동아리 수: " + myClubs.size());
        for (UserClub uc : myClubs) {
            System.out.println("클럽 ID: " + uc.getClub().getClubId() + ", 사용자 ID: " + uc.getUser().getUserId());
        }

        // UserClub → UserClubResponseDto 변환하여 반환
        return myClubs.stream()
                .map(UserClubResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ClubResponseDto getClub(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));

        // 리더 정보 가져오기
        List<UserClub> leaders = userClubRepository.findLeadersByClubId(clubId, RoleType.PRESIDENT, RoleType.VICE_PRESIDENT);
        List<ClubLeaderDto> leaderDtos = leaders.stream().map(ClubLeaderDto::fromEntity).collect(Collectors.toList());

        // 멤버 수 가져오기
        int membersCount = userClubRepository.countByClubId(clubId);

        return ClubResponseDto.fromEntity(club, leaderDtos, membersCount);
    }

    // 특정 사용자가 클럽 내에서 권한이 있는지 확인하는 메서드
    @Override
    @Transactional(readOnly = true)
    public boolean checkUserPermission(Long userId, Long clubId) {
        // 프록시를 사용하여 트랜잭션 적용된 메서드 호출
        ClubService proxyService = applicationContext.getBean(ClubService.class);
        String userRole = proxyService.getUserRoleInClub(userId, clubId);

        return "PRESIDENT".equals(userRole) || "VICE_PRESIDENT".equals(userRole);
    }

    // 동아리 멤버 조회 (ClubMemberResponseDto 사용)
    @Override
    @Transactional(readOnly = true)
    public List<ClubMemberResponseDto> getClubMembers(Long clubId) {
        List<UserClub> members = userClubRepository.findByClub_ClubId(clubId);

        return members.stream()
                .map(member -> new ClubMemberResponseDto(
                        member.getUser().getUserId(),
                        member.getUser().getName(),  // 사용자 이름 추가
                        member.getRole().getRoleName().name() // 역할 정보 추가
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ClubArticleResponseDto createArticle(Long clubId, Long userId, String title, String content,
                                                String uploadedFileName, boolean is_notice) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다. userId: " + userId));

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다."));

        String storageThumbUrl = (uploadedFileName != null && !uploadedFileName.isEmpty())
                ? uploadedFileName
                : "default-thumbnail.png"; // 기본 이미지

        ClubArticleRequestDto requestDto = new ClubArticleRequestDto(title,
                content, storageThumbUrl, is_notice);

        Article newArticle = requestDto.toEntity(club, user, is_notice);
        clubArticleRepository.save(newArticle);

        return ClubArticleResponseDto.fromEntity(newArticle);
    }

    @Override
    public ArticleListResponseDto getArticlesList(Long clubId, int limit, int offset) {
        List<Article> articleList = clubArticleRepository.findByClub_ClubId(clubId);

        int total = articleList.size();

        List<Article> paginatedArticles = articleList.stream()
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());

        return ArticleListResponseDto.fromEntity(paginatedArticles, total, limit, offset);
    }

    @Override
    public ClubArticleResponseDto updateArticle(Long userId, Long clubId, Long articleId, ArticleModificationRequestDto requestDto) {

        Article article = clubArticleRepository.findByArticleId(articleId)
                .orElseThrow(() -> new NoSuchElementException("해당 ID의 게시물이 존재하지 않습니다."));

        if(!article.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 게시물을 수정할 권한이 없습니다.");
        }

        article.setTitle(requestDto.getTitle());
        article.setContents(requestDto.getContents());
        article.setThumbUrl(requestDto.getThumbUrl());

        clubArticleRepository.save(article);

        return ClubArticleResponseDto.fromEntity(article);
    }

    @Override
    public SpecificArticleResponseDto getArticleDetail(Long clubId, Long articleId) {
//        authorDto author = new authorDto(userId, username);

        boolean check = clubArticleRepository.existsByClub_ClubId(clubId);
        if(!check) {
            throw new NoSuchElementException("존재 하지 않는 동아리입니다.");
        }

        Article article = clubArticleRepository.findByArticleId(articleId)
                .orElseThrow(() -> new NoSuchElementException("해당 ID의 게시물이 존재하지 않습니다."));

        return SpecificArticleResponseDto.fromEntity(article);
    }

    @Override
    public boolean deleteArticle(Long clubId, Long articleId, Long userId) {

        Article article = clubArticleRepository.findByClubIdAndArticleId(clubId, articleId)
                .orElseThrow(() -> new NoSuchElementException("해당 클럽에 게시글이 존재하지 않습니다."));


        if(!article.getUser().getUserId().equals(userId)&& !checkUserPermission(userId, articleId)) {
            return false;
        }
        clubArticleRepository.delete(article);
        return true;
    }

}
