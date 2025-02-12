package com.example.teamproject2025.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @Autowired
    private HttpSession session;

    @PostMapping("/set-session")
    public ResponseEntity<String> setTestSession() {
        session.setAttribute("userId", 1L); // 테스트할 사용자 ID
        session.setAttribute("delete_email_verified", true);

        System.out.println("Session 설정 완료: " + session.getId());
        System.out.println("Stored userId: " + session.getAttribute("userId"));
        System.out.println("Stored delete_email_verified: " + session.getAttribute("delete_email_verified"));

        return ResponseEntity.ok("Test session created.");
    }
}