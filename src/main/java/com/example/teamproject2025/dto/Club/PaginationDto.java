package com.example.teamproject2025.dto.Club;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "페이지네이션 정보 DTO")
public class PaginationDto {
    @Schema(description = "전체 항목 수", example = "1")
    private int total;

    @Schema(description = "한 페이지에 표시할 항목 수", example = "12")
    private int limit;

    @Schema(description = "현재 페이지의 오프셋", example = "0")
    private int offset;
}