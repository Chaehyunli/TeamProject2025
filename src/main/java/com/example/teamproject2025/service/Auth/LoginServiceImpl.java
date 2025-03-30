package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.User.BanUserResponseDto;
import com.example.teamproject2025.dto.User.UserLoginRequestDto;
import com.example.teamproject2025.dto.User.UserLoginResponseDto;
import com.example.teamproject2025.entity.Chat.ChatMessage;
import com.example.teamproject2025.entity.User.BanUser;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Chat.ChatMessageRepository;
import com.example.teamproject2025.repository.User.BanUserRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BanUserRepository banUserRepository;

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
        Optional<BanUser> checkBanUser = banUserRepository.findByUser(user); // 없다고 에러 내서는 안됨
        if (checkBanUser.isPresent()){
            BanUser banUser = checkBanUser.get();
            LocalDate allowedLoginDate = banUser.getAllowedLoginDate();
            int daysLeft = (int) ChronoUnit.DAYS.between(LocalDate.now(), allowedLoginDate);

            if (daysLeft < 0){
                System.out.println("\n\n⚠️⚠️⚠️daysLeft cannot be negative⚠️⚠️⚠️\n\n");
                throw new IllegalArgumentException("daysLeft cannot be negative");
            } else {
                System.out.println("\n\n⚠️⚠️⚠️You are currently restricted from logging in⚠️⚠️⚠️\n\n");
                throw new AccessDeniedException("You are currently restricted from logging in." +
                        "\nYou will be able to log in on " + allowedLoginDate + ".");
            }
        }

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
