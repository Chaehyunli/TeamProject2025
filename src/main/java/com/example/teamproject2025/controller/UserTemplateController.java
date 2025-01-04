package com.example.teamproject2025.controller;

import com.example.teamproject2025.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.ui.Model;
import com.example.teamproject2025.entity.User;

@Controller
public class UserTemplateController {

    private final UserRepository userRepository; // final로 설정해 불변성 보장

    // 생성자 정의 (Spring에서 의존성 주입)
    public UserTemplateController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user-form")
    public String showUserForm(Model model) {
        model.addAttribute("user", new User());
        return "user-form";
    }

    @PostMapping("/user-form")
    public String submitUserForm(@ModelAttribute User user, Model model) {
        try {
            userRepository.save(user); // 데이터 저장
            model.addAttribute("message", "사용자 정보가 성공적으로 저장되었습니다!");
        } catch (Exception e) {
            model.addAttribute("message", "저장 중 오류가 발생했습니다: " + e.getMessage());
            return "user-form"; // 오류가 발생한 경우에도 같은 페이지로 반환
        }
        return "user-form"; // 성공적으로 저장된 경우
    }
}
