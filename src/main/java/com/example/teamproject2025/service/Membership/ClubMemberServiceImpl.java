package com.example.teamproject2025.service.Membership;

import com.example.teamproject2025.dto.Membership.ClubMemberResponseDto;
import com.example.teamproject2025.dto.Membership.GrantAuthorityRequestDto;
import com.example.teamproject2025.dto.Membership.LeaveClubRequestDto;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Membership.RoleType;
import com.example.teamproject2025.entity.Membership.UserClub;
import com.example.teamproject2025.entity.Membership.UserRole;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Club.ClubRepository;
import com.example.teamproject2025.repository.Membership.UserClubRepository;
import com.example.teamproject2025.repository.Membership.UserRoleRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubMemberServiceImpl implements ClubMemberService {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final UserClubRepository userClubRepository;
    private final UserRoleRepository userRoleRepository;

    // 특정 회원에게 권한을 부여
    public void grantAuthority(Long grantorUserId, GrantAuthorityRequestDto requestDto){
        Long targetUserId = requestDto.getTargetUserId();
        Long clubId = requestDto.getClubId();
        RoleType roleType = RoleType.valueOf(requestDto.getRole());

        // 1. 대상 사용자가 해당 동아리 회원인지 확인
        boolean isMember = userClubRepository.existsByUser_UserIdAndClub_ClubId(targetUserId, clubId);
        if (!isMember) {
            throw new RuntimeException("해당 사용자는 동아리 회원이 아닙니다.");
        }

        // 2. User, Club 엔티티 조회
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));

        // 3. 현재 역할 가져오기 (권한을 부여하는 사람)
        RoleType grantorRole = userRoleRepository.findByUser_UserIdAndClub_ClubId(grantorUserId, clubId)
                .map(UserRole::getRoleName)
                .orElseThrow(() -> new RuntimeException("권한을 부여할 수 없는 사용자입니다."));

        // 4. 대상 사용자의 현재 역할 가져오기
        RoleType targetUserRole = userRoleRepository.findByUser_UserIdAndClub_ClubId(targetUserId, clubId)
                .map(UserRole::getRoleName)
                .orElseThrow(() -> new RuntimeException("해당 사용자는 동아리에서 역할을 가지고 있지 않습니다."));

        // 5. 회장만 역할을 변경할 수 있음
        if (grantorRole != RoleType.PRESIDENT) {
            throw new RuntimeException("회장만 역할을 변경할 수 있습니다.");
        }

        // 6. 현재 회장의 역할을 변경할 수 없음(회장 넘기기는 가능)
        if (targetUserRole == RoleType.PRESIDENT) {
            throw new RuntimeException("회장의 역할은 변경할 수 없습니다.");
        }

        // 7. 회장을 넘기는 경우: 본인은 MEMBER로, 대상자는 PRESIDENT로
        if (roleType == RoleType.PRESIDENT) {
            // 7-1. 대상자 역할 갱신
            UserRole newPresidentRole = userRoleRepository.findByUser_UserIdAndClub_ClubId(targetUserId, clubId)
                    .orElseGet(() -> UserRole.builder()
                            .user(targetUser)
                            .club(club)
                            .build());

            newPresidentRole.setRoleName(RoleType.PRESIDENT);

            userRoleRepository.save(newPresidentRole);

            // 7-2. 본인(기존 회장)의 역할을 MEMBER로 갱신
            User grantorUser = userRepository.findById(grantorUserId)
                    .orElseThrow(() -> new RuntimeException("회장 사용자를 찾을 수 없습니다."));
            UserRole oldPresidentRole = userRoleRepository.findByUser_UserIdAndClub_ClubId(grantorUserId, clubId)
                    .orElseThrow(() -> new RuntimeException("회장 역할을 찾을 수 없습니다."));

            oldPresidentRole.setRoleName(RoleType.MEMBER);

            userRoleRepository.save(oldPresidentRole);

            return;
        }

        // 8. 기존 역할이 있으면 업데이트, 없으면 새로 생성
        UserRole userRole = userRoleRepository.findByUser_UserIdAndClub_ClubId(targetUserId, clubId)
                .orElseGet(() -> UserRole.builder()
                        .user(targetUser)
                        .club(club)
                        //.roleName(roleType)
                        .build());

        // 9. 역할 업데이트 및 저장
        userRole.setRoleName(roleType);
        userRoleRepository.save(userRole);
    }

    @Override
    @Transactional
    public void leaveClub(Long currentUserId, LeaveClubRequestDto requestDto) {
        Long targetUserId = requestDto.getTargetUserId();
        Long clubId = requestDto.getClubId();

        // 동아리 존재 여부 확인
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("해당 동아리를 찾을 수 없습니다."));

        // 회장이 본인을 강퇴하려는 경우 방지
        if (club.getPresident().getUserId().equals(targetUserId)) {
            throw new IllegalArgumentException("회장 본인을 강퇴할 수 없습니다.");
        }

        // 강퇴 대상이 동아리에 속해 있는지 확인
        UserClub userClub = userClubRepository.findByClub_ClubIdAndUser_UserId(clubId, targetUserId)
                .orElseThrow(() -> new RuntimeException("해당 사용자는 동아리 회원이 아닙니다."));

        // 강퇴 대상의 역할(UserRole) 삭제
        List<UserRole> userRoles = userRoleRepository.findByClub_ClubIdAndUser_UserId(clubId, targetUserId);

        // 강퇴 대상의 동아리 회원(UserClub) 삭제
        userClubRepository.delete(userClub);
        userRoleRepository.deleteAll(userRoles);
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
}
