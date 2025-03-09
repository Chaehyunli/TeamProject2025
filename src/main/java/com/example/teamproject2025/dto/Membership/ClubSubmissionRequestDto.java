package com.example.teamproject2025.dto.Membership;

import com.example.teamproject2025.entity.Club.Club;
import com.example.teamproject2025.entity.Membership.ClubSubmission;
import com.example.teamproject2025.entity.User.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ClubSubmissionRequestDto {
    private String studentId;
    private String contact;
    private String department;
    private String contents;

    // DTO → Entity 변환
    public ClubSubmission toEntity(User user, Club club) {
        return ClubSubmission.builder()
                .user(user)
                .club(club)
                .studentId(this.studentId)
                .contact(this.contact)
                .department(this.department)
                .contents(this.contents)
                .status(ClubSubmission.SubmissionStatus.PENDING)  // 기본값 설정
                .build();
    }
}

