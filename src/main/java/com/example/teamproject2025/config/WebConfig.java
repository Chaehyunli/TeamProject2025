package com.example.teamproject2025.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // API 경로에 대해
                        .allowedOrigins("http://localhost:3000") // React의 주소
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // 동아리 썸네일
                registry.addResourceHandler("/uploads/clubs/**")
                        .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/clubs/");

                // 프로필 사진 추가
                registry.addResourceHandler("/uploads/profile/**")
                        .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/profile/");
                // 프론트에서
                // http://localhost:8080/uploads/clubs/{파일명}
                // http://localhost:8080/uploads/profile/{파일명}
                // 으로 접근 가능
            }
        };
    }
}
