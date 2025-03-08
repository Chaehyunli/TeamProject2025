package com.example.teamproject2025.dto.Membership;

import com.example.teamproject2025.entity.Membership.ClubSubmission;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserSubmissionsUpdateResponseDto {
    private Long applyId;
    private Long userId;
    private Long clubId;
    private String contact;
    private String contents;
    private String status;
    private LocalDateTime updatedAt;

    public UserSubmissionsUpdateResponseDto(ClubSubmission submission) {
        this.applyId = submission.getApplyId();
        this.userId = submission.getUser().getUserId();
        this.clubId = submission.getClub().getClubId();
        this.contact = submission.getContact();
        this.contents = submission.getContents();
        this.status = submission.getStatus().name();
        this.updatedAt = submission.getUpdatedAt();
    }
}
