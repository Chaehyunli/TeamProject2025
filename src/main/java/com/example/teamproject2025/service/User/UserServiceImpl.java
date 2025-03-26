package com.example.teamproject2025.service.User;

import com.example.teamproject2025.constant.DefaultImage;
import com.example.teamproject2025.dto.Chat.MyChatListResDto;
import com.example.teamproject2025.dto.Club.ClubSummaryDto;
import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserListResDto;
import com.example.teamproject2025.dto.User.UserResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import com.example.teamproject2025.entity.Chat.ChatRoom;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Chat.ChatRoomRepository;
import com.example.teamproject2025.repository.University.UniversityRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import com.example.teamproject2025.service.Chat.ChatService;
import com.google.cloud.storage.Storage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final PasswordEncoder passwordEncoder;
    private final Storage storage;
    private final ChatService chatService;
    private final ChatRoomRepository chatRoomRepository;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

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
        return UserResponseDto.toDTO(user, dto.getUniversityName());
    }

    @Override
    public UserResponseDto updateUserProfile(Long userId, UserUpdateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 기존 이미지 삭제 로직 추가(Google Cloud)
        if (dto.getProfileImage() != null
                && !dto.getProfileImage().equals(user.getProfileImage())
                && !dto.getProfileImage().equals(DefaultImage.PROFILE_IMAGE)) {
            deleteImageFromGCS(user.getProfileImage()); // 기존 이미지 삭제 (기본 이미지 제외)
        }

        // PATCH 방식이므로 값이 존재하는 경우에만 업데이트
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getProfileImage() != null) user.setProfileImage(dto.getProfileImage());
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getStudentId() != null) user.setStudentId(dto.getStudentId());
        if (dto.getDepartment() != null) user.setDepartment(dto.getDepartment());

        user.setUpdatedAt(LocalDateTime.now());

        return UserResponseDto.toDTO(user);
    }

    // Google Cloud Storage에서 기존 이미지 삭제
    private void deleteImageFromGCS(String objectName) {
        if (objectName == null || objectName.trim().isEmpty()) return; // null 또는 빈 값 방지
        if (DefaultImage.PROFILE_IMAGE.equals(objectName)) return; // 기본 프로필 이미지는 삭제하지 않음

        boolean deleted = storage.delete(bucketName, objectName); // GCS에서 객체 삭제
        if (deleted) {
            System.out.println("✅ 기존 프로필 이미지 삭제 완료: " + objectName);
        } else {
            System.err.println("❌ 기존 프로필 이미지 삭제 실패 (이미 삭제되었거나 존재하지 않음): " + objectName);
        }
    }

    @Override
    public void deleteUser(HttpSession session) {
        // 현재 로그인한 사용자 확인
        Long sessionUserId = (Long) session.getAttribute("userId");
        Boolean deletedMailVerified = (Boolean) session.getAttribute("deleted_mail_verified"); // Ref4

        if (sessionUserId == null) {
            throw new IllegalStateException("Invalid user session or unauthorized request");
        }

        if (deletedMailVerified == null || !deletedMailVerified) {
            throw new IllegalStateException("Email verification required before account deletion");
        }

        // 유저 존재 여부 확인
        User user = userRepository.findById(sessionUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 사용자가 참여한 모든 개인 채팅방에서 나가기
        List<MyChatListResDto> myChatRooms = chatService.getMyChatRoomsByUser(user);
        for (MyChatListResDto chatRoomDto : myChatRooms) {
            if (!chatRoomDto.getIsGroupChat()) { // 그룹 채팅은 제외하고 개인 채팅방만 처리
                ChatRoom chatRoom = chatRoomRepository.findById(
                    chatRoomDto.getRoomId())
                    .orElseThrow(()-> new EntityNotFoundException("room cannot be found"));
                chatRoomRepository.delete(chatRoom);
            }
        }

        // 기존 프로필 이미지 삭제 (기본 프로필 제외)
        if (user.getProfileImage() != null && !user.getProfileImage().equals(DefaultImage.PROFILE_IMAGE)) {
            deleteImageFromGCS(user.getProfileImage());
        }

        // 유저 삭제
        userRepository.delete(user);

        // 세션 무효화
        session.invalidate();
    }

    @Override
    public List<UserListResDto> findAll(){
        List<User> users = userRepository.findAll();
        List<UserListResDto> userListResDtos = new ArrayList<>();
        for (User m : users){
            UserListResDto userListResDto = UserListResDto.builder()
                    .userId(m.getUserId())
                    .email(m.getEmail())
                    .name(m.getName())
                    .build();

            userListResDtos.add(userListResDto);
        }
        return userListResDtos;
    }

    @Transactional
    public UserResponseDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // universityName을 조회 (UniversityRepository 사용)
        String universityName = universityRepository.findByUniversityId(user.getUniversityId())
                .map(university -> university.getUniversityName())
                .orElse(null); // 대학이 없을 경우 null 반환

        // 사용자가 가입한 동아리 목록 조회
        List<ClubSummaryDto> joinedClubs = user.getUserClubs().stream()
                .map(userClub -> ClubSummaryDto.fromEntity(userClub.getClub()))
                .toList();

        // 사용자가 운영하는 동아리 목록 조회 (회장 또는 부회장인 경우만)
        List<ClubSummaryDto> managedClubs = user.getUserClubs().stream()
                .filter(userClub -> userClub.getRole().getRoleName().name().equals("PRESIDENT") ||
                        userClub.getRole().getRoleName().name().equals("VICE_PRESIDENT"))
                .map(userClub -> ClubSummaryDto.fromEntity(userClub.getClub()))
                .toList();

        return UserResponseDto.toDTO(user, joinedClubs, managedClubs, universityName);
    }

    @Override
    public void resetUserProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 존재하지 않는 사용자"));

        // 기존 프로필 이미지 삭제 (기본 이미지가 아닐 때만)
        if (user.getProfileImage() != null && !user.getProfileImage().equals(DefaultImage.PROFILE_IMAGE)) {
            deleteImageFromGCS(user.getProfileImage());
        }

        // 기본 프로필 이미지로 설정
        user.setProfileImage(DefaultImage.PROFILE_IMAGE);
        userRepository.save(user);
    }

}



/* 💡Descriptions @dev_taehyun
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
*
*     Ref4. 두가지 방식의 처리가 가능하다. 첫번째는 이메일의 인증걸과로 프론트에서
*           response.data 를 받은 후, 이를 API 요청과 함께 body 에 실어서 보내는 방법.
*           두번째는 Front 에서 response.data 를 보고 동일한 JSESSIONID 에 대해
*           session 에 속성 값을 추가하는 방법이 있다. (더 있을 수도 있고...)
*
*           delete 는 요청 시 requestBody 가 없으니 dev_seohyeon 님의 방식대로 가는게 깔끔할 것이다.
*
*     Ref5. 이건 Load Balancing 환경에서는 Session 이 여러 서버 간에 공유될 수 있는데,
*           이때 속성이 남아있을 가능성이 있다. 이 말은 삭제 요청을 했음에도 다른 서버에 남아있을 수 있다는 소리다.
*           프로젝트를 AWS 에 load 할 때 서버의 부하를 줄이기 위해서 ELB 를 사용할 수도 있을텐데,
*           이게 로드밸런싱 하는건데, 이때 예기치 못한 에러가 발생할 수 있다는거다.
*           (근데 우린 단일 Instance 쓸거라 이건 해당안됨 -> 비용 이슈...)
*
*           또한, Multi-Thread 환경에서도 문제가 될 수 있다. SPring Boot 의 HTTP 요청처리는 기본적으로
*           멀티쓰레드 환경에서 실행된다. 하지만 각 요청은 서도 다른 쓰레드에서 실행되므로, 요청 간 순서가 항상 보장되지 않는다.
*           그렇게 되면 A 요청에서 invalidate 호출한 직후, 다른 Thread 에서 Session 이 무효화되었음에도 불구하고
*           B 요청으로 해당 속성을 사용하려고 할 수도 있다. 그럼 당연히 IllegalStateException 이 발생할 것이다.
*           (Java로 Singleton Pattern 구현할 때 Synchronized 를 사용하는게 이러한 맥락 때문)
*
*           따라서, 이러한 문제를 방지하려면 명시적으로 먼저 delete_email_verified 를 삭제해주는게 좋다.
*           이건 특정 순간에만 존재하는 속성이면서도 보안적으로 중요한 이슈를 떠안는 그런 속성에 대해서 적용하면 좋으며,
*           모든 특성에 대해서 이렇게 처리할 필요는 없다. -> delete_email_verified 만 명시적으로 삭제함
*
*
*     Ref6. 이메일 인증이 끝나면 delete_email_verified 의 Session 값을 서버에서 처리하려면?
*
*           이메일 API 를 건드리면 회원가입했을 때 세션이 필요없음에도 세션을 만들게 됨 -> X
*           그러면 session update 를 위한 별도 API 를 만들면 될 것 같음
*           근데 이러면 session update 안하고 회원가입때처럼 response.data 를
*           request body 에 실어서 요청하면 그 값으로 인증완료 처리 가능.
*           이건 일단 냅두고, 좀 논의해봐야할거같음. 어찌되었건 방법만 정해지면 구현은 쉬워서 큰 문제 안될듯
*
* */