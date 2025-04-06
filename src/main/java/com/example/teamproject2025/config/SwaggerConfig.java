package com.example.teamproject2025.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "동아리모아 API 문서",
                description = "동아리모아의 백엔드 API 명세서",
                version = "v1.0.0"
        )
)
public class SwaggerConfig {
}
