package com.example.teamproject2025.dto.Common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommonResponseDto<T> {
    private String message;
    private int status;
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
