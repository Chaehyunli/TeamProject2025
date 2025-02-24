package com.example.teamproject2025.controller.Upload;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.HttpMethod;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    // Presigned URL 생성 (파일 업로드)
    @GetMapping("/presigned-url")
    public ResponseEntity<CommonResponseDto<Map<String, String>>> generatePresignedUrl(
            @RequestParam String fileName) {
        //         // UUID를 파일명에 적용하여 고유한 객체명 생성
        String uniqueFileName = UUID.randomUUID() + "_" + fileName;
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, uniqueFileName).build();

        // 15분 유효 기간의 presigned URL 생성
        URL signedUrl = storage.signUrl(blobInfo, 15, TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.PUT),
                Storage.SignUrlOption.withV4Signature());

        Map<String, String> result = Map.of(
                "url", signedUrl.toString(),
                "objectName", uniqueFileName
        );

        return ResponseEntity.ok(CommonResponseDto.success(200, "Presigned URL 생성 성공", result));
    }

    // Presigned URL 생성 (파일 로드/다운로드)
    @GetMapping("/presigned-url/download")
    public ResponseEntity<CommonResponseDto<Map<String, String>>> generatePresignedGetUrl(
            @RequestParam String objectName) {
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, objectName).build();

        // 15분 유효 기간의 presigned URL 생성 (GET 방식)
        URL signedUrl = storage.signUrl(blobInfo, 15, TimeUnit.MINUTES,
                Storage.SignUrlOption.httpMethod(HttpMethod.GET),
                Storage.SignUrlOption.withV4Signature());

        Map<String, String> result = Map.of("url", signedUrl.toString());
        return ResponseEntity.ok(CommonResponseDto.success(200, "Presigned GET URL 생성 성공", result));
    }
}
