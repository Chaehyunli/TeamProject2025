package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.service.User.BanUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutServiceImpl implements LogoutService {

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false); // 현재 세션 가져오기 (없으면 null)

        if (session == null) {
            // ✅ 세션이 없는 경우 -> 400 Bad Request 반환
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeResponse(response, "{\"message\": \"No active session found\"}");
            return;
        }

        // 현재 인증된 사용자 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalStateException("No authenticated user found in security context.");
        }

        // 요청에서 세션 ID 가져오기
        String requestSessionId = getSessionIdFromRequest(request);

        // 현재 세션 ID 가져오기
        String currentSessionId = session.getId();

        // 요청된 세션 ID가 현재 세션과 일치하는 경우에만 로그아웃 수행
        if (requestSessionId == null || !requestSessionId.equals(currentSessionId)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            writeResponse(response, "{\"message\": \"Invalid session ID. Logout failed.\"}");
            return;
        }

        // ✅ 로그아웃 성공 로그 출력
        System.out.println("✅ 로그아웃 성공 - 세션 무효화 진행");

        session.invalidate();
        SecurityContextHolder.clearContext();
        removeJSessionCookie(response);

        // ✅ 성공 응답 반환
        response.setStatus(HttpServletResponse.SC_OK);
        writeResponse(response, "{\"message\": \"Logged out successfully\"}");
    }

    // 요청에서 JSESSIONID 추출
    private String getSessionIdFromRequest(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("JSESSIONID".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    // JSESSIONID 쿠키 삭제 (올바른 세션 로그아웃 시만 수행)
    private void removeJSessionCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    // JSON 응답을 반환하는 메서드
    private void writeResponse(HttpServletResponse response, String jsonMessage) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(jsonMessage);
            response.getWriter().flush();
        } catch (Exception e) {
            throw new RuntimeException("Failed to write response: " + e.getMessage(), e);
        }
    }
}