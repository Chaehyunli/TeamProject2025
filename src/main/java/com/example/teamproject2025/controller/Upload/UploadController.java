package com.example.teamproject2025.controller.Upload;

import com.example.teamproject2025.Common.annotation.ApiCommonErrorResponses;
import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.HttpMethod;
import com.google.cloud.storage.Storage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
public class UploadController {

    private final Storage storage;
    @Value("${GCP_BUCKET}")
    private String bucketName;

    @Operation(
            summary = "Presigned URL 생성 (업로드용)",
            description = "GCP Storage에 파일 업로드를 위한 Presigned URL을 생성. 기본적으로 image/png, image/jpeg만 허용"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Presigned URL Generation Successful.",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
           "url": "https://storage.googleapis.com/...",
           "objectName": "uuid_filename.png"
        }
        """))
            )
    })
    @ApiCommonErrorResponses
    @GetMapping("/presigned-url")
    public ResponseEntity<CommonResponseDto<Map<String, String>>> generatePresignedUrl(
            @RequestParam String fileName, @RequestParam(required = false) String fileType) {
        // 기본값으로 image/* 만 허용
        if (fileType == null || fileType.isBlank() || !fileType.startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CommonResponseDto.error(400, "❌ Not supported file types (PNG, JPG only)"));
        }

        // UUID를 파일명에 적용하여 고유한 객체명 생성
        String uniqueFileName = UUID.randomUUID() + "_" + fileName;
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, uniqueFileName).build();

        // 5분 유효 기간의 presigned URL 생성
        URL signedUrl = storage.signUrl(blobInfo, 5, TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.PUT),
                Storage.SignUrlOption.withV4Signature());

        Map<String, String> result = Map.of(
                "url", signedUrl.toString(),
                "objectName", uniqueFileName
        );

        return ResponseEntity.ok(CommonResponseDto.success(200, "Presigned URL Generation Successful.", result));
    }

    @Operation(
            summary = "Presigned URL 생성 (다운로드용)",
            description = "GCP Storage에서 파일을 다운로드하기 위한 Presigned URL을 생성"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Presigned GET URL Generation Successful.",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
           "url": "https://storage.googleapis.com/..."
         }
        """))
            )
    })
    @ApiCommonErrorResponses
    @GetMapping("/presigned-url/download")
    public ResponseEntity<CommonResponseDto<Map<String, String>>> generatePresignedGetUrl(
            @RequestParam String objectName) {
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, objectName).build();

        // 5분 유효 기간의 presigned URL 생성 (GET 방식)
        URL signedUrl = storage.signUrl(blobInfo, 5, TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.GET),
                Storage.SignUrlOption.withV4Signature());

        Map<String, String> result = Map.of("url", signedUrl.toString());
        return ResponseEntity.ok(CommonResponseDto.success(200, "Presigned GET URL Generation Successful.", result));
    }
}