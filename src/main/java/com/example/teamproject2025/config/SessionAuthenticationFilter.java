package com.example.teamproject2025.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

// @dev_seohyun
@Component  // ✅ Spring Bean으로 등록
public class SessionAuthenticationFilter extends OncePerRequestFilter { // Ref1,2

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false); // 기존 세션이 있으면 가져오고, 없으면 null 반환

        if (session != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Long userId = (Long) session.getAttribute("userId");

            if (userId != null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, Collections.emptyList()); // 권한 없이 인증된 사용자 설정. Ref3
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Spring Security 컨텍스트에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication); // Ref4
            }
        }

        chain.doFilter(request, response); // Ref5
    }
}

/* 💡 Descriptions
*
*     Ref1. SessionAuthenticationFilter : 세션 기반으로 로그인된 유저인지 확인한다.
*     Ref2. OncePerRequestFilter : Spring Security 에서 인증/권한 부여 관련 필터 만들 때 사용
*           한 HTTP 요청에 단 한번 실행된다는 특징이 있다.
*           이 필터의 내부 처리는 doFilterInternal Method 를 overriding 해서 정의한다.
*
*     Ref3. UsernamePasswordAuthenticationToken : Session 속 userId 기반으로 인증 객체 생성
*     Ref4. SecurityContextHolder : IoC 처럼 Containter 임.
*
*           IoC 는 Bean 을 관리한다면, 얘는 인증/권한 정보를 관리함.
*           즉, 여기에 인증정보를 넣어놓으면, 이 컨테이너가 알아서 관리하니까 이후 요청에서도 인증된 상태를 유지한다는 소리임.
*
*     Ref5. chain.doFilter : 현재 필터의 역할이 끝나면, 다음 필터로 요청을 넘긴다는 소리
*
*           Spring Security 는 여러개의 Filter 로 돌아가는데,
*           예를 들어, SessionAuthenticationFilter 이게 끝나면 다음 Filter 로 넘긴다.
*           다음 필터의 예로는 UsernamePasswordAuthenticationFilter 이런게 될 수 있겠다.
*           물론, 이미 SecurityContextHolder 에 인증정보를 관리하고 있으니 이 예시에선 Pass 될 듯
* */