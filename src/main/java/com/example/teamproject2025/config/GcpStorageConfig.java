package com.example.teamproject2025.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class GcpStorageConfig {
    @Value("${GCP_CREDENTIALS_PATH}")
    private String credentialsPath;

    @Bean
    public Storage storage() throws IOException {
        // src/main/resources 내 JSON 키 파일을 읽음
        InputStream keyFile = new ClassPathResource(credentialsPath).getInputStream();

        return StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(keyFile)) // 키 파일을 스트림으로 읽어 GCP 인증
                .build()
                .getService();
    }
}
