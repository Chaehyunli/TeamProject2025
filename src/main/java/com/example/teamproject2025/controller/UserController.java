package com.example.teamproject2025.controller;

import com.example.teamproject2025.dto.UserDto;
import com.example.teamproject2025.entity.User;
import com.example.teamproject2025.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users") // API 엔드포인트
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public String createUser(@RequestBody UserDto userDto) {
        try {
            // DTO -> 엔티티 변환
            User user = new User();
            user.setName(userDto.getName());
            user.setEmail(userDto.getEmail());
            userRepository.save(user);
            return "사용자 정보가 성공적으로 저장되었습니다!";
        } catch (Exception e) {
            return "저장 중 오류가 발생했습니다: " + e.getMessage();
        }
    }
}
