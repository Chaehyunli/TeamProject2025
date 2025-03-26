package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.*;
import com.example.teamproject2025.dto.Membership.ClubMemberResponseDto;
import com.example.teamproject2025.dto.Membership.UserClubResponseDto;

import java.io.IOException;
import java.util.List;

public interface ClubService {
    Long createClub(String username, String clubName, String description, String category, String uploadedFileName) throws IOException;
    ClubListResponseDto getClubsByUserUniversity(String username, int limit, int offset);

    String getUserRoleInClub(Long userId, Long clubId);

    List<UserClubResponseDto> getMyClubs(Long userId);
    ClubResponseDto getClub(Long clubId);

    boolean checkUserPermission(Long userId, Long clubId);

    boolean checkUserIsPresident(Long userId, Long clubId);

    ClubArticleResponseDto createArticle(Long clubId, Long userId, String title, String content, String uploadedFileName, boolean is_notice);

    boolean deleteArticle(Long clubId, Long articleId, Long userId);

    ClubArticleResponseDto updateArticle(Long userId, Long clubId, Long articleId, ArticleModificationRequestDto requestDto);

    SpecificArticleResponseDto getArticleDetail(Long clubId, Long articleId);

    ArticleListResponseDto getArticlesList(Long clubId, int limit, int offset);

    NoticeCreateResponseDto createNotice(Long clubId, Long userId, NoticeCreateRequestDto requestDto);

    NoticeListResponseDto getNoticeList(Long clubId, int limit, int offset);

    NoticeModifyResponseDto updateNotice(Long userId, Long clubId, Long noticeId, NoticeModifyRequestDto requestDto );

    boolean deleteNotice(Long clubId, Long noticeId, Long userId);

    SpecificNoticeResponseDto getNoticeDetail(Long clubId, Long noticeId);

    void updateClubThumbnail(String username, Long clubId, String objectName);

    void resetClubThumbnail(String username, Long clubId);

    ClubListResponseDto searchClubsByUserUniversity(String username, String search, int limit, int offset);

    void deleteClub(Long clubId, Long userId);

}
