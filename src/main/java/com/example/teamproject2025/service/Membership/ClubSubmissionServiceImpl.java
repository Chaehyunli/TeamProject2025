package com.example.teamproject2025.service.Membership;

import com.example.teamproject2025.dto.Membership.*;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Membership.ClubSubmission;
import com.example.teamproject2025.entity.Membership.RoleType;
import com.example.teamproject2025.entity.Membership.UserClub;
import com.example.teamproject2025.entity.Membership.UserRole;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Club.ClubRepository;
import com.example.teamproject2025.repository.Membership.ClubSubmissionRepository;
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
public class ClubSubmissionServiceImpl implements ClubSubmissionService {

    private final ClubSubmissionRepository clubSubmissionRepository;
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final UserClubRepository userClubRepository;
    private final UserRoleRepository userRoleRepository;

    @Override
    @Transactional
    public Long submitApplication(Long userId, Long clubId, ClubSubmissionRequestDto dto) {

        // 이미 지원한 내역이 있는지 확인
        boolean exists = clubSubmissionRepository.existsByUser_UserIdAndClub_ClubId(userId, clubId);

        if (exists) {
            throw new IllegalStateException("이미 해당 동아리에 지원한 기록이 있습니다.");
        }

        // 사용자 및 동아리 조회
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("동아리를 찾을 수 없습니다."));

        // 새로운 지원서 저장
        ClubSubmission submission = dto.toEntity(user, club);
        clubSubmissionRepository.save(submission);
        return submission.getApplyId();
    }

    // 사용자의 동아리 지원 여부 확인
    @Override
    @Transactional(readOnly = true)
    public boolean hasUserApplied(Long userId, Long clubId) {
        return clubSubmissionRepository.existsByUser_UserIdAndClub_ClubId(userId, clubId);
    }

    // 특정 동아리에 대한 지원서 목록 조회
    @Override
    @Transactional(readOnly = true)
    public List<ClubSubmissionResponseDto> getSubmissionsByClub(Long clubId) {
        List<ClubSubmission> submissions = clubSubmissionRepository.findByClub_ClubId(clubId);
        return submissions.stream()
                .map(ClubSubmissionResponseDto::new)
                .collect(Collectors.toList());
    }

    // 특정 지원서 상세정보 조회
    @Override
    public ClubSubmissionResponseDto getApplicationDetails(Long clubId, Long applyId) {
        ClubSubmission submission = clubSubmissionRepository.findByClub_ClubIdAndApplyId(clubId, applyId)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));

        return new ClubSubmissionResponseDto(submission);
    }

    // 특정 지원서 승인
    public void approveSubmission(Long clubId, Long applyId) {
        ClubSubmission submission = clubSubmissionRepository.findById(applyId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지원서입니다."));

        // 지원서가 해당 동아리에 속해 있는지 확인
        if (!submission.getClub().getClubId().equals(clubId)) {
            throw new IllegalArgumentException("이 지원서는 해당 동아리에 속해 있지 않습니다.");
        }

        // 이미 승인된 지원서는 다시 승인할 수 없음
        if (submission.getStatus() == ClubSubmission.SubmissionStatus.APPROVED) {
            throw new IllegalStateException("이미 승인된 지원서입니다.");
        }

        // 지원 상태 변경 (APPROVED)
        submission.setStatus(ClubSubmission.SubmissionStatus.APPROVED);
        clubSubmissionRepository.save(submission);

        // 해당 사용자를 동아리 회원으로 등록
        addUserToClub(submission.getUser(), submission.getClub());

        // 지원서 삭제 (승인된 지원서는 필요 없음)
        clubSubmissionRepository.delete(submission);
    }

    // 특정 지원서 거절
    public void rejectSubmission(Long clubId, Long applyId) {
        ClubSubmission submission = clubSubmissionRepository.findById(applyId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지원서입니다."));

        // 지원서가 해당 동아리에 속해 있는지 확인
        if (!submission.getClub().getClubId().equals(clubId)) {
            throw new IllegalArgumentException("이 지원서는 해당 동아리에 속해 있지 않습니다.");
        }

        // 이미 거절된 지원서는 다시 거절할 수 없음
        if (submission.getStatus() == ClubSubmission.SubmissionStatus.REJECTED) {
            throw new IllegalStateException("이미 거절된 지원서입니다.");
        }

        // 지원 상태 변경 (REJECTED)
        submission.setStatus(ClubSubmission.SubmissionStatus.REJECTED);
        clubSubmissionRepository.save(submission);

        // 지원서 삭제(거절된 지원서는 필요 없음)
        clubSubmissionRepository.delete(submission);
    }

    // 동아리 회원에 추가
    private void addUserToClub(User user, Club club) {
        // 이미 회원인지 확인
        boolean isAlreadyMember = userClubRepository.existsByUser_UserIdAndClub_ClubId(user.getUserId(), club.getClubId());
        if (isAlreadyMember) {
            throw new IllegalStateException("이미 동아리 회원입니다.");
        }

        // MEMBER 역할 추가 (user_roles 테이블)
        UserRole memberRole = UserRole.builder()
                .user(user)
                .club(club)
                .roleName(RoleType.MEMBER) // ENUM 사용
                .build();
        userRoleRepository.save(memberRole);

        // user_clubs 테이블에 회원 추가
        UserClub userClub = UserClub.builder()
                .user(user)
                .club(club)
                .role(memberRole) // 역할과 연결
                .build();
        userClubRepository.save(userClub);
    }

    // 사용자의 지원서 조회
    @Override
    @Transactional(readOnly = true)
    public List<ClubSubmissionResponseDto> getSubmissionsByUser(Long userId) {
        List<ClubSubmission> submissions = clubSubmissionRepository.findByUser_UserId(userId);

        return submissions.stream()
                .map(ClubSubmissionResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 사용자의 특정 지원서 상세 조회
    @Override
    @Transactional(readOnly = true)
    public ClubSubmissionResponseDto getSubmissionById(Long applyId) {
        return clubSubmissionRepository.findById(applyId)
                .map(ClubSubmissionResponseDto::new)
                .orElse(null);
    }


    // 내 지원서 수정
    @Override
    @Transactional
    public UserSubmissionsUpdateResponseDto updateSubmission(Long userId, Long applyId, UserSubmissionsUpdateRequestDto updateDto) {
        // 지원서 찾기
        ClubSubmission submission = clubSubmissionRepository.findById(applyId)
                .orElseThrow(() -> new IllegalArgumentException("해당 지원서를 찾을 수 없습니다."));

        // 사용자가 본인의 지원서인지 확인
        if (!submission.getUser().getUserId().equals(userId)) {
            return null;
        }

        // 지원 상태가 PENDING일 때만 수정 가능
        if (!submission.getStatus().equals(ClubSubmission.SubmissionStatus.PENDING)) {
            throw new IllegalStateException("이미 처리된 지원서는 수정할 수 없습니다.");
        }

        // 값 업데이트
        submission.setContact(updateDto.getContact());
        submission.setContents(updateDto.getContents());

        // 변경된 지원서 저장
        clubSubmissionRepository.save(submission);

        return new UserSubmissionsUpdateResponseDto(submission);
    }

    // 내 지원서 삭제
    @Override
    @Transactional
    public boolean deleteSubmission(Long userId, Long applyId) {
        ClubSubmission submission = clubSubmissionRepository.findById(applyId)
                .orElse(null);

        if (submission == null || !submission.getUser().getUserId().equals(userId)) {
            return false; // 지원서가 없거나, 본인 지원서가 아닐 경우
        }

        clubSubmissionRepository.delete(submission);
        return true; // 삭제 성공
    }

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

        // 3. 해당 동아리에서 기존 역할 조회
        UserRole userRole = userRoleRepository.findByUser_UserIdAndClub_ClubId(targetUserId, clubId)
                .orElseGet(() -> UserRole.builder()
                        .user(targetUser)
                        .club(club)
                        .roleName(roleType)
                        .build());

        // 4. 역할 업데이트 및 저장
        userRole.setRoleName(roleType);
        userRoleRepository.save(userRole);
    }

}
