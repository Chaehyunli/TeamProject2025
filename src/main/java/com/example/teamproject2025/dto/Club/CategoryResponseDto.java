package com.example.teamproject2025.dto.Club;

import com.example.teamproject2025.entity.Club.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryResponseDto {
    private Long categoryId;
    private String categoryName;

    public static CategoryResponseDto fromEntity(Category category) {
        return new CategoryResponseDto(category.getCategoryId(), category.getCategoryName());
    }
}
