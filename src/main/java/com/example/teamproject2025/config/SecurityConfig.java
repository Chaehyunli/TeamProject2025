//package com.example.teamproject2025.config;
//
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import java.util.List;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean // dev_taehyun + dev_chaehyun
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
//                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())) // X-Frame-Options 비활성화
//                .cors(cors -> cors.configurationSource(corsConfigurationSource())) //  CORS 설정 추가
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/api/v1/auth/login",
//                                "/api/v1/users/register",
//                                "/api/v1/auth/session",
//                                "/error",
//                                "/api/v1/auth/email",
//                                "/api/v1/auth/email/verify"
//                        ).permitAll()  // 로그인 및 회원가입 허용
//                        .requestMatchers("/api/v1/users").authenticated()
//                        .anyRequest().authenticated()  // 그 외 요청은 인증 필요
//                )
////                .sessionManagement(session -> session
////                        .maximumSessions(1)  // 하나의 세션만 허용 -> Example: 사파리에서 로그인하고 크롬에서 로그인하면 사파리는 로그아웃됨
//////                        .expiredUrl("/login") // 세션 만료 시 로그인 페이지 이동
////                )
//                .httpBasic(httpBasic -> httpBasic.disable()) // 기본 인증 비활성화 (팝업 방지)
//                .formLogin(form -> form.disable()) //  폼 로그인 비활성화 (팝업 방지)
////                .logout(logout -> logout
////                        .logoutUrl("/api/v1/auth/logout")
////                        .logoutSuccessUrl("/login")
////                        .permitAll()
////                );
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // 새로운 세션 생성 방지
//                )
//                .logout(logout -> logout
//                        .logoutUrl("/api/v1/auth/logout")
//                        .logoutSuccessHandler((request, response, authentication) -> {
//                            HttpSession session = request.getSession(false);
//                            if (session != null) {
//                                session.invalidate();
//                            }
//                            response.setStatus(HttpServletResponse.SC_OK);
//                            response.getWriter().write("{\"message\": \"Logged out successfully\"}");
//                            response.getWriter().flush();
//                        })
//                )
//                .addFilterBefore(new SessionAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//
//
//        return http.build();
//    }
//
//    @Bean
//    PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    // CORS 설정 추가
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080")); // React 개발 서버
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
//        configuration.setAllowCredentials(true); // 세션 유지
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//}

package com.example.teamproject2025.config;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SessionAuthenticationFilter sessionAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ CSRF 보호 비활성화 (세션을 사용하므로 불필요)
                .csrf(csrf -> csrf.disable())

                // ✅ CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ 인증 및 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/auth/login",
                                "/api/v1/users/register",
                                "/api/v1/auth/session",
                                "/error",
                                "/api/v1/auth/email",
                                "/api/v1/auth/email/verify",
                                "/api/v1/auth/find-id",
                                "/api/v1/auth/password-reset",
                                "/connect/**"
                        ).permitAll() // 인증 없이 접근 가능

                        .requestMatchers("/api/v1/users/delete").authenticated() // 회원탈퇴는 인증 필요
                        .anyRequest().authenticated() // 그 외 요청도 인증 필요
                )

                // ✅ 세션 관리 정책 (인증된 사용자만 세션 유지)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // ✅ 기본 인증 및 폼 로그인 비활성화 (REST API 방식에 불필요)
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            // ✅ 인증된 사용자만 로그아웃 가능하도록 수정
                            if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                response.getWriter().write("{\"message\": \"Unauthorized: No authenticated user found\"}");
                                response.getWriter().flush();
                                return;
                            }

                            HttpSession session = request.getSession(false);
                            if (session != null) {
                                session.invalidate();
                            }

                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("{\"message\": \"Logged out successfully\"}");
                            response.getWriter().flush();
                        })
                )
                // ✅ 세션 기반 인증 필터 추가 (이전에 실행되도록 설정)
                .addFilterBefore(sessionAuthenticationFilter, LogoutFilter.class)
                .addFilterBefore(sessionAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS 설정 정리
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080")); // React 개발 서버
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // 세션 유지

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
