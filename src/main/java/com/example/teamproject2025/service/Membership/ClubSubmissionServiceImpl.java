package com.example.teamproject2025.service.Membership;

import com.example.teamproject2025.dto.Membership.ClubSubmissionRequestDto;
import com.example.teamproject2025.dto.Membership.ClubSubmissionResponseDto;
import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Membership.ClubSubmission;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Club.ClubRepository;
import com.example.teamproject2025.repository.Membership.ClubSubmissionRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClubSubmissionServiceImpl implements ClubSubmissionService {

    private final ClubSubmissionRepository clubSubmissionRepository;
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;

    public ClubSubmissionServiceImpl(ClubSubmissionRepository clubSubmissionRepository, UserRepository userRepository, ClubRepository clubRepository) {
        this.clubSubmissionRepository = clubSubmissionRepository;
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
    }

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

    @Override
    @Transactional(readOnly = true)
    public List<ClubSubmissionResponseDto> getApplicationsByClub(Long clubId) {
        return clubSubmissionRepository.findByClub_ClubId(clubId).stream()
                .map(ClubSubmissionResponseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubSubmissionResponseDto> getApplicationsByUser(Long userId) {
        return clubSubmissionRepository.findByUser_UserId(userId).stream()
                .map(ClubSubmissionResponseDto::new)
                .collect(Collectors.toList());
    }
}
