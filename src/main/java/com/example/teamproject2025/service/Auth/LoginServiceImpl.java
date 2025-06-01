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
            throw new IllegalArgumentException("사용자 ID 및 비밀번호를 입력하세요.");
        }

        // 사용자 조회
        User user = (User) userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다 : " + username));

        // 제재 대상 유저인가 검증
        Optional<BanUser> checkBanUser = banUserRepository.findByUser(user); // 없다고 에러 내서는 안됨
        if (checkBanUser.isPresent()){
            BanUser banUser = checkBanUser.get();
            LocalDate allowedLoginDate = banUser.getAllowedLoginDate();
            int daysLeft = (int) ChronoUnit.DAYS.between(LocalDate.now(), allowedLoginDate);

            if (daysLeft <= 0){
                banUserRepository.deleteByUser(user);
                System.out.println("BanUser 삭제됨: " + user.getUsername());
            } else {
                System.out.println("\n\n⚠️⚠️⚠️당신은 현재 제재 상태로, 로그인 할 수 없습니다.⚠️⚠️⚠️\n\n");
                throw new AccessDeniedException("당신은 현재 제재 상태로, 로그인 할 수 없습니다." +
                        "\n로그인 가능 일자는 " + allowedLoginDate + " 입니다.");
            }
        }

        // System Log
        System.out.println("DB에서 찾은 사용자: " + user.getUsername());
        System.out.println("입력한 비밀번호: " + password);
        System.out.println("DB 저장된 비밀번호: " + user.getPassword());

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("잘못된 패스워드 입니다.");
        }

        // 세션 저장
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("name", user.getName());

        return UserLoginResponseDto.toDTO(user);
    }

}
