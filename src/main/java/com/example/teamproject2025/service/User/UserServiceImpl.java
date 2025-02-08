package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserDetailResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.User.UniversityRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetailResponseDto register(UserCreateRequestDto dto) {
        // universityName으로 universityId 조회
        Integer universityId = universityRepository.findByUniversityName(dto.getUniversityName())
                .orElseThrow(() -> new IllegalArgumentException("University not found: " + dto.getUniversityName()))
                .getUniversityId();

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // DTO → Entity 변환 및 저장
        User user = userRepository.save(dto.toEntity(universityId, encodedPassword));

        return UserDetailResponseDto.builder()
                .username(user.getUsername())
                .studentId(Integer.parseInt(user.getStudentId()))
                .university(dto.getUniversityName())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .joinedClubs(List.of())
                .managedClubs(List.of())
                .build();
    }

    @Override
    public UserDetailResponseDto update(Long userId, UserUpdateRequestDto dto){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User updatedUser = user.update(dto);

        userRepository.save(updatedUser);

        return UserDetailResponseDto.builder()
                .username(updatedUser.getUsername())
                .studentId(Integer.parseInt(updatedUser.getStudentId()))
                .university(null) // 추가 로직 필요 시 처리
                .email(updatedUser.getEmail())
                .profileImage(updatedUser.getProfileImage())
                .build();

    }
}
