package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.Auth.EmailResponseDto;
import com.example.teamproject2025.dto.Auth.FindUserIdResponseDto;
import com.example.teamproject2025.dto.Auth.ResetUserPasswordRequestDto;
import com.example.teamproject2025.dto.User.UserLoginResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.User.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindUserAuthServiceImpl implements FindUserAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public FindUserIdResponseDto findUserId(EmailResponseDto dto) {
        System.out.println("아이디 찾기 요청: " + dto);

        String email = dto.getEmail();
        Boolean isEmailVerified = dto.getIsEmailVerified();

        if (email == null || !isEmailVerified) {
            throw new IllegalArgumentException("Invalid Email or Not Verified");
        }

        // 사용자 조회
        User user = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        // System Log
        System.out.println("DB에서 찾은 사용자: " + user.getUsername());

        return FindUserIdResponseDto.toDTO(user);
    }

    @Override
    @Transactional // 자동으로 변경 사항 저장하려고
    public void resetUserPassword(ResetUserPasswordRequestDto dto) {

        System.out.println("비밀번호 재설정 요청: " + dto);

        String email = dto.getEmail();
        String username = dto.getUsername();
        String newPassword = dto.getNewPassword();
        String confirmPassword = dto.getConfirmPassword();
        Boolean isEmailVerified = dto.getIsEmailVerified();

        if (email == null || !isEmailVerified) {
            throw new IllegalArgumentException("Invalid Email or Not Verified");
        }

        if(!dto.isPasswordMatched(newPassword, confirmPassword)){
            throw new IllegalArgumentException("Passwords do not match");
        }

        // 비밀번호 해싱
        String encodedPassword = passwordEncoder.encode(newPassword);

        // 비밀번호 보안 수준

        // 사용자 식별
        User user = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found" + email));

        String oldPassword = user.getPassword();
        if (passwordEncoder.matches(newPassword, oldPassword)) {
            throw new IllegalArgumentException("New password must be different from the old password");
        }

        if(username == null || !username.equals(user.getUsername())){
            throw new IllegalArgumentException("Username does not match");
        }

        // 비밀번호 업데이트
//        User updatedUser = user.updatePassword(encodedPassword);
        user.updatePassword(encodedPassword);

//        userRepository.save(updatedUser);

        // System Log
        System.out.println("비밀번호 재설정 완료: " + oldPassword + " -> " + user.getPassword());
    }
}
