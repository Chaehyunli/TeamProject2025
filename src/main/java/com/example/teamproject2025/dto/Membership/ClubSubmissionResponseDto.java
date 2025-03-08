package com.example.teamproject2025.dto.Membership;

import com.example.teamproject2025.entity.Membership.ClubSubmission;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
public class ClubSubmissionResponseDto {
    private Long applyId;
    private Long userId;
    private Long clubId;
    private String clubName; // 동아리 이름 추가
    private String studentId;
    private String contact;
    private String department;
    private String contents;
    private String status;
    private String createdAt;  // 날짜 형식 변경
    private String updatedAt;  // 날짜 형식 변경

    // 날짜 포맷 설정
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ClubSubmissionResponseDto(ClubSubmission submission) {
        this.applyId = submission.getApplyId();
        this.clubId = submission.getClub().getClubId();
        this.clubName = submission.getClub().getClubName(); // 동아리 이름 추가
        this.userId = submission.getUser().getUserId();
        this.studentId = submission.getStudentId();
        this.contact = submission.getContact();
        this.department = submission.getDepartment();
        this.contents = submission.getContents();
        this.status = submission.getStatus().name();
        this.createdAt = submission.getCreatedAt().format(FORMATTER); // 날짜 포맷 적용
        this.updatedAt = submission.getUpdatedAt().format(FORMATTER); // 날짜 포맷 적용
    }

    // fromEntity 정적 메서드 추가
    public static ClubSubmissionResponseDto fromEntity(ClubSubmission submission) {
        return new ClubSubmissionResponseDto(submission);
    }
}

