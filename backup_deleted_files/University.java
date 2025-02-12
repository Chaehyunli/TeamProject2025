package com.example.teamproject2025.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "university_id")
    private Long universityId;

    @Column(name = "university_name", nullable = false, length = 100)
    private String universityName;
}