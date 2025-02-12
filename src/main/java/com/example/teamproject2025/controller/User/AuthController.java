package com.example.teamproject2025.controller.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @PostMapping("/logout")
    public ResponseEntity<CommonResponseDto<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // CSRF 토큰 제거 -> Spring Security에서 관리

        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(
                        HttpStatus.OK.value(),
                        "Logged out successfully. The session is terminated",
                        null
                ));
    }
}

/* 💡 Descriptions @dev_taehyun
*
*     dev_chaehyun 기존 코드 ::
*
*       import org.springframework.web.bind.annotation.RestController;

        import java.util.Map;

        @RestController
        @RequestMapping("/api/v1/auth")
        public class AuthController {
            // POST
            @PostMapping("/logout")
            public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request, HttpServletResponse response) {
                HttpSession session = request.getSession(false);
                if(session != null){
                    session.invalidate();
                }

                // CSRF 토큰 제거 -> Spring Security에서 관리

                Cookie cookie = new Cookie("JSESSIONID", null);
                cookie.setPath("/");
                cookie.setHttpOnly(true);
                cookie.setMaxAge(0);
                response.addCookie(cookie);

                return ResponseEntity.ok(Map.of(
                        "status", "200",
                        "message", "Logged out successfully. The session is terminated."
                ));
            }
        }
*
*     Ref1. 어떻게 Refactoring 했나요?
*
*     1. ResponseEntity 의 타입을 CommonResponseDto 로 설정했습니다.
*        그 근거는, Swagger 에서 CommonResponse 를 사용함으로써
*        일관된 응답형식을 채택하기로 했기 때문입니다.
*
*     2. return 형식을 ResponseEntity 에서 status 와 body로 분류하고,
*        body 에 CommonResponseDto 를 내보냈습니다. 근거는 위와 동일합니다.
*
* */