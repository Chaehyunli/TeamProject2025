package com.example.teamproject2025.ExceptionHandler;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 중복 데이터 예외 처리
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<CommonResponseDto<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(CommonResponseDto.error(HttpStatus.CONFLICT.value(), "Duplicate entry detected."));
    }

    // 기본 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponseDto<Void>> handleGenericException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred."));
    }

    // 잘못된 Argument 가 들어왔을 때 예외 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CommonResponseDto<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(CommonResponseDto.error(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
    }

    // Run Time Error
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<CommonResponseDto<Void>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()));
    }

    // State 에 따른 예외처리
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<CommonResponseDto<Void>> handleIllegalStateException(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(CommonResponseDto.error(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
    }

    // DTO 검증 실패 시 400 응답
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponseDto<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        BindingResult bindingResult = ex.getBindingResult();

        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        if (errors.size() == 1) {
            String firstErrorMessage = errors.values().iterator().next(); // 첫 번째 값 추출
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CommonResponseDto.error(HttpStatus.BAD_REQUEST.value(), firstErrorMessage));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(CommonResponseDto.error(HttpStatus.BAD_REQUEST.value(), errors.toString()));
    }

    // 사용자 정의 예외 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CommonResponseDto<Void>> handleCustomException(CustomException e) {
        return ResponseEntity.status(e.getStatus())
                .body(CommonResponseDto.error(e.getStatus(), e.getMessage()));
    }
}

// 누락된 예외들이 있을거임. 추후 리팩터링 해야할 때 이것도 꼼꼼히 챙겨야 할 듯