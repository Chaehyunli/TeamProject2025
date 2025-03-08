package com.example.teamproject2025.entity.Club;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId; // 카테고리 고유 ID

    @Column(nullable = false, unique = true, length = 50)
    private String categoryName; // 카테고리 이름
}