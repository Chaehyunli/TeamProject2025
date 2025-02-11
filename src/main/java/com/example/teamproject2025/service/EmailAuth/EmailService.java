package com.example.teamproject2025.service.EmailAuth;

import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.EmailAuth.RedisEmailVerificationRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final RedisEmailVerificationRepository redisEmailVerificationRepository;

    private static final String EMAIL_SUBJECT = "Email Verification";

    // 이메일 인증 요청 메서드
    public void sendVerificationEmail(String email){
        // 사용자 확인
//        User user = (User) userRepository.findByEmail(email)
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String verificationCode = generateVerificationCode(); // 6자리 인증번호 생성
        redisEmailVerificationRepository.saveVerificationCode(email, verificationCode); // Redis에 인증번호 저장

        String emailBody = generateVerificationEmailBody(verificationCode);

        sendEmail(email, EMAIL_SUBJECT, emailBody);
    }

    // 이메일 본문 생성 메서드
    private String generateVerificationEmailBody(String verificationCode) {
        return "아래 인증번호를 입력하여 이메일을 인증하세요:\n\n" + verificationCode + "\n\n"
                + "인증번호는 5분간 유효합니다.";
    }

    // 6자리 인증번호 생성
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 100000 ~ 999999 사이 숫자 생성
        return String.valueOf(code);
    }

    // 이메일 전송 부 구현
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    // 이메일 인증 확인
    public void verifyEmail(String email, String verificationCode){
        // Redis 에서 token 을 확인해야 함
        String savedCode = redisEmailVerificationRepository.getVerificationCode(email);
        if (savedCode == null || !savedCode.equals(verificationCode)) {
            throw new IllegalArgumentException("Invalid or expired verification code");
        }

        // 사용자 인증 상태를 User 데이터베이스에 업데이트 해야함 (의문: 이거에도 updated_at 을 적용해야하나)
        User user = (User) userRepository.findByEmail(email) // 아니 싀발 왜 자꾸 캐스팅 안하면 에러내는거야
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 이제 isEmailVerified 를 True 로 바꿔야 함
        // 여기서 Setter 방식과 Builder Pattern 의 선택기준이 갈림 -> Trade-Off 불가피
        /*
            1. Update : 자주 변경되는 필드를 단순히 업데이트 할 VS 불필요하게 객체를 새로 생성하므로 복잡해짐
            2. Integrity : 데이터 무결성이 필요 없는 경우 VS 데이터 무결성을 보장하며, 의도 명확
            3. Readability : 코드가 단순해짐 VS 변경 사항이 명확히 드러남
            4. Design Complexibility :	설계가 단순해짐 VS 설계가 복잡해질 수 있음
            5. Entity Design Pricipals : 엔티티 내부 상태가 외부에 의해 쉽게 변경될 수 있음 VS 외부에서 상태를 직접 변경할 수 없으므로 안전

            즉, 단순함 VS 안전성 인데.. 소비자들의 개인정보가 들어가있는 만큼 안전성이 최우선 아니겠는가?
            그럼 뭐 매번 안전성만 챙기는가? 단순한 방식은 대체 언제 채택하는데?
        */
        // 코드 구현성의 단순함을 해결하기엔 Method 만한게 없지 -> update method 도 구현한다.

        User updatedUser = user.update(UserUpdateRequestDto.builder()
                .isEmailVerified(true) // 이메일 인증만 업데이트
                .build());

        userRepository.save(updatedUser);

        // 인증번호 삭제
        redisEmailVerificationRepository.deleteVerificationCode(email);
    }

}
