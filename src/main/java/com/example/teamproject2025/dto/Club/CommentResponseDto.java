package com.example.teamproject2025.dto.Club;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean deleted;
    private List<CommentResponseDto> children;

    public static class CommentResponseDtoBuilder {
        private List<CommentResponseDto> children = new ArrayList<>();
    }
}

