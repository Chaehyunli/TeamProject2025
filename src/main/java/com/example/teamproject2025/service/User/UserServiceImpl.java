package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserDetailResponseDto;
import com.example.teamproject2025.dto.User.UserResponseDto;
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
    public UserResponseDto register(UserCreateRequestDto dto) {
        // 1. universityName으로 universityId 조회 -> 서비스 가능한 대학교인가?
        Long universityId = universityRepository.findByUniversityName(dto.getUniversityName())
                .orElseThrow(() -> new IllegalArgumentException("University not found: " + dto.getUniversityName()))
                .getUniversityId();

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // 3. 이메일이 인증된다면, isVerified = true 인 dto 를 불러온다. Ref1,2,3
        if (!dto.getIsEmailVerified()) {
            System.out.println("이메일 인증이 완료되지 않았습니다."); // Temporary
            throw new IllegalArgumentException("Email is not Verified");
        }

        // 4. DTO → Entity 변환 및 저장
        User user = userRepository.save(dto.toEntity(universityId, encodedPassword));

        // 5. Client 에게 응답할 DTO Build
//        return UserResponseDto.builder()
//                .username(user.getUsername())
//                .studentId(Integer.parseInt(user.getStudentId()))
//                .university(dto.getUniversityName())
//                .email(user.getEmail())
//                .profileImage(user.getProfileImage())
//                .joinedClubs(List.of())
//                .managedClubs(List.of())
//                .build();

        // 5. Client 에게 응답할 DTO Build
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .studentId(user.getStudentId())
                .universityId(user.getUniversityId())
                .universityName(dto.getUniversityName())
                .isEmailVerified(user.getIsEmailVerified())
                .isUniVerified(user.getIsUniVerified())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public UserResponseDto update(Long userId, UserUpdateRequestDto dto){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User updatedUser = user.update(dto);

        userRepository.save(updatedUser);

        return UserResponseDto.builder()
                .username(updatedUser.getUsername())
                .studentId(updatedUser.getStudentId())
                .universityName(null) // 추가 로직 필요 시 처리
                .email(updatedUser.getEmail())
                .profileImage(updatedUser.getProfileImage())
                .build();

    }
}

/* 💡Descriptions
*
*     Ref1. 그냥 isVerified 처리하면 되지, 왜 dto 로 받아오나요?
*
*           이메일 인증은 회원가입에서만 구현되는 기능이 아니다. -> 일관성이 중요하다.
*           기능이 추가될 수록 코드가 많아지고, 그럼 추후 코드 볼 때 가뜩이나 힘들텐데
*           어떤건 그냥 바꾸고 어떤건 dto 로 가져오고 그러면 코드 읽기 싫어질 것 같다.
*           (이건 회원가입과는 독립된 API 라서 이렇게 처리하는거임)
*
*     Ref2. Front 입장에서 보면, 이메일 인증이 먼저 수반된다.
*           그 말은, 회원가입할 때는 이메일 인증은 Database 와 연결하면 안된다는 것이다. *Ref2-1
*           EmailResponseDto 만 Response 하고, 이걸 Register 단에서 수신해서
*           UserReqeustDto 에 값을 추가한다. 그리고 이제 비로소 등록한다.
*           그렇다면 UserRequestDto 에는 isEmailVerified 가 들어가 있어야한다는 뜻
*           -> Swagger 수정해야한다.
*
*           (대안) 서로 다른 DTO 를 통합해서 저장하도록 할 수는 없을까?
*                 가능은 할텐데, 어떤게 더 효율적일까?
*
*           Ref2-1. 회원정보 수정할 때, 이메일 수정 처리가 가능하도록 했으므로,
*                   이때는 데이터베이스에 접근이 필요하다.
*
*     Ref3. 이메일 인증에 대한 응답은 Front 단에서 수집하고 DTO 로 넣어줘야 한다.
*           이메일 인증에 대한 response 객체에서 data 를 추출한 후,
*           이걸 Register 요청할 때 Body 에 넣어주기만 하면 된다.
*           Backend 의 경우는 Postman 등으로 테스트를 진행한다면,
*           isVerified 의 부분이 true 인지 False 인지 임의로 시나리오 상정해서
*           검증하면 된다.
*
* */