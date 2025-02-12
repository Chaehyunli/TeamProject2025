package com.example.teamproject2025.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProfileData {
    private String name;

    private String studentId;

    private String university;

    private String email;

    private String profileImage;

    private List<ClubInfo> joinedClubs;

    private List<ClubInfo> managedClubs;
}
