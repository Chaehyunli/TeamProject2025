package com.example.teamproject2025.service.Club;

import com.example.teamproject2025.dto.Club.CategoryResponseDto;
import com.example.teamproject2025.repository.Club.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
