package com.example.teamproject2025.config;

import org.springframework.boot.web.servlet.server.Session;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.session.web.http.HttpSessionIdResolver;
import org.springframework.session.web.http.HeaderHttpSessionIdResolver;

@Configuration
public class SessionConfig {

    @Bean
    public DefaultCookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setSameSite("None");  // ✅ 사파리에서도 세션 유지 가능
        serializer.setUseSecureCookie(true);  // ✅ HTTPS 환경에서만 작동 (로컬 개발 시 false 가능)
        return serializer;
    }

    @Bean
    public HttpSessionIdResolver httpSessionIdResolver() {
        return HeaderHttpSessionIdResolver.xAuthToken();  // ✅ 세션 ID를 HTTP 헤더에서 관리
    }
}
