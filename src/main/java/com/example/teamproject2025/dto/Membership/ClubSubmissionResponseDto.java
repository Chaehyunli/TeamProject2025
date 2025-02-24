package com.example.teamproject2025.dto.Membership;

import com.example.teamproject2025.entity.Membership.ClubSubmission;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ClubSubmissionResponseDto {
    private Long applyId;
    private Long clubId;
    private String studentId;
    private String contact;
    private String department;
    private String contents;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ClubSubmissionResponseDto(ClubSubmission submission) {
        this.applyId = submission.getApplyId();
        this.clubId = submission.getClub().getClubId();
        this.studentId = submission.getStudentId();
        this.contact = submission.getContact();
        this.department = submission.getDepartment();
        this.contents = submission.getContents();
        this.status = submission.getStatus().name();
        this.createdAt = submission.getCreatedAt();
        this.updatedAt = submission.getUpdatedAt();
    }
}
