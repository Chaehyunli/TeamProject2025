package com.example.teamproject2025.controller;

import com.example.teamproject2025.entity.User;
import com.example.teamproject2025.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // DELETE
    @DeleteMapping
    public ResponseEntity<?> deleteUser(HttpSession session) {

        System.out.println("Session ID: " + session.getId());
        System.out.println("Stored userId in session: " + session.getAttribute("userId"));
        System.out.println("Stored delete_email_verified in session: " + session.getAttribute("delete_email_verified"));

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }

        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        // 이메일 인증 여부 확인 (현재 테스트 단계이므로 true로 설정)
        // 인증 부분에서 delete_email_verified 값 저장
        Boolean deleteEmailVerified = (Boolean) session.getAttribute("delete_email_verified");
        if (deleteEmailVerified == null || !deleteEmailVerified) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Email verification required for account deletion"));
        }

        userService.deleteUserById(userId);
        session.invalidate();

        return ResponseEntity.ok(Map.of("message", "User successfully deleted"));
    }
}