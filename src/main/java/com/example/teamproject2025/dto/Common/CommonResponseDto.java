package com.example.teamproject2025.dto.Common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "모든 API 표준 응답 DTO")
public class CommonResponseDto<T> {
    @Schema(description = "각 API의 응답 설명이 곧 반환 메시지입니다.", example = "Success")
    private String message;

    @Schema(description = "HTTP status code", example = "200")
    private int status;

    @Schema(description = "Actual response data. Can be null on error or empty responses.", example = "null")
    private T data;

    // Success Response
    public static <T> CommonResponseDto<T> success(int status, String message) {
        return CommonResponseDto.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .build();
    }

    public static <T> CommonResponseDto<T> success(int status, String message, T data) {
        return CommonResponseDto.<T>builder()
                .status(status)
                .message(message)
                .data(data)
                .build();
    }

    // Error Response

    public static CommonResponseDto<Void> error(int status) {
        String message = switch (status) {
            case 400 -> "Bad Request: The request is invalid.";
            case 401 -> "Unauthorized: Authentication is required.";
            case 403 -> "Forbidden: Access to the resource is denied.";
            case 404 -> "Not Found: The requested resource could not be found.";
            case 409 -> "Conflict - Resource already exists";
            case 413 -> "Payload Too Large - The request entity is too large";
            case 500 -> "Internal Server Error: An unexpected error occurred.";
            default -> "Unexpected Error: An unknown error occurred. Please contact support.";
        };

        return CommonResponseDto.<Void>builder()
                .status(status)
                .message(message)
                .build();
    }

    public static <T> CommonResponseDto<T> error(int status, String customMessage) {
        return CommonResponseDto.<T>builder()
                .status(status)
                .message(customMessage)
                .build();
    }
}
