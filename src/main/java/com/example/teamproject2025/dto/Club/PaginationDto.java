package com.example.teamproject2025.dto.Club;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginationDto {
    private int total;
    private int limit;
    private int offset;
}