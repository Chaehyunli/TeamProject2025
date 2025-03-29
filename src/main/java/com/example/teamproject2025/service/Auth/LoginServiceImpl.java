package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.User.UserLoginRequestDto;
import com.example.teamproject2025.dto.User.UserLoginResponseDto;
import com.example.teamproject2025.entity.Chat.ChatMessage;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Chat.ChatMessageRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public UserLoginResponseDto login(UserLoginRequestDto dto, HttpSession session) {

        // JSON 데이터 정상 수신 여부 확인
        System.out.println("로그인 요청: " + dto);

        String username = dto.getUsername();
        String password = dto.getPassword();

        if (username == null || password == null) {
            throw new IllegalArgumentException("Invalid request: missing username or password");
        }

        // 사용자 조회
        User user = (User) userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        // 제재 대상 유저인가 검증
//        int cumBadWordCount = chatMessageRepository.countBadWordMessagesByUser(user);
//
//        switch (cumBadWordCount) {
//            case 1:
//                throw new IllegalArgumentException("Your cumulative profanity count is 1 times, so you are subject to a 15-day penalty.");
//            case 2:
//                throw new IllegalArgumentException("Your cumulative profanity count is 2 times, so you are subject to a 20-day penalty.");
//            case 3:
//                throw new IllegalArgumentException("Your cumulative profanity count is 3 times, so you are subject to a 25-day penalty.");
//            case 4:
//                throw new IllegalArgumentException("Your cumulative profanity count is 4 times, so you are subject to a 30-day penalty.");
//        }

        // System Log
        System.out.println("DB에서 찾은 사용자: " + user.getUsername());
        System.out.println("입력한 비밀번호: " + password);
        System.out.println("DB 저장된 비밀번호: " + user.getPassword());

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid Password");
        }

        // 세션 저장
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("name", user.getName());

        return UserLoginResponseDto.toDTO(user);
    }

}
