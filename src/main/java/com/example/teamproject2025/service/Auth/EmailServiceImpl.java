package com.example.teamproject2025.service.Auth;

import com.example.teamproject2025.dto.Auth.EmailResponseDto;
import com.example.teamproject2025.repository.Auth.RedisEmailVerificationRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final RedisEmailVerificationRepository redisEmailVerificationRepository;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private static final String EMAIL_SUBJECT = "Email Verification";

    // 이메일 인증 요청 메서드
    @Override
    public void sendVerificationEmail(String email){

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
        int code = 100000 + SECURE_RANDOM.nextInt(900000); // 100000 ~ 999999 사이 숫자 생성
        return String.valueOf(code);
    }

    // 이메일 전송 부 구현
    @Override
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Send Mail is Failed: " + e.getMessage(), e);
        }
    }

    // 이메일 인증 확인
    @Override
    public EmailResponseDto verifyEmail(String email, String verificationCode){
        try {
            String savedCode = redisEmailVerificationRepository.getVerificationCode(email);
            if (savedCode == null) { // Ref3
                throw new IllegalArgumentException("Invalid or Expired Verification Code");
            }

            if (!savedCode.equals(verificationCode)) {
                throw new IllegalArgumentException("Verification Code is not matched");
            }

            // 인증번호 삭제
            redisEmailVerificationRepository.deleteVerificationCode(email);

            return EmailResponseDto.builder()
                    .email(email)
                    .isEmailVerified(true)
                    .build();

        } catch (RuntimeException e) {
             throw new RuntimeException("Email Verification is Failed: " + e.getMessage(), e);
        }
    }
}

/* 💡Descriptions
*
*     Ref1. 원래 기존에는 EmailService 처리 부분에서 user 정보 업데이트 하도록 하였다.
*
*           User user = (User) userRepository.findByEmail(email)
*               .orElseThrow(() -> new IllegalArgumentException("User not found"));
*
*           User updatedUser = user.update(UserUpdateRequestDto.builder()
*               .isEmailVerified(true) // 이메일 인증만 업데이트
*               .build());
*
*           userRepository.save(updatedUser);
*
*           이건데, 이것도 회원가입과 마찬가지로, 인증이 되어야 바꿀 수 있는거니까
*           여기서 업데이트 처리를 하지 않는다.
*           프로필 수정 API 에서 회원가입과 같은 메커니즘으로 진행하면 된다.
*           조금 다른게 있다면, 회원가입과는 달리 일부데이터만 보내서 위의 코드처럼만 처리하면 됨
*
*     Ref2. Setter 방식과 Builder Pattern 의 선택기준 -> Trade-Off 불가피
*
*           위의 코드를 보면 알겠지만, 하나의 값만 수정하려는 상황이었다.
*           이런 상황이라면 Setter 를 쓰면 정말 편할 것이다.
*           하지만 DB 와 직접적으로 연관된 부분은 보안 상의 이유로 Setter 를 지양한다고 한다.
*           그러한 이유로 트레이드 오프를 진행해보고자 한다.
*
*           Setter VS Builder
*
*           1. Update : 자주 변경되는 필드를 단순히 업데이트 할 VS 불필요하게 객체를 새로 생성하므로 복잡해짐
*           2. Integrity : 데이터 무결성이 필요 없는 경우 VS 데이터 무결성을 보장하며, 의도 명확
*           3. Readability : Lombok 쓰는거 아니면 드러움 VS 변경 사항이 명확히 드러남 * Lombok 은 너무 단순한 Setter 만 제공
*           4. Design Complexibility : 설계가 단순해짐 VS 설계가 복잡해질 수 있음
*
*           시나리오를 생각해보면, 하나의 객체를 만들어 놓고 뇌빼고 코딩하다가 set 으로 내부를 바꿔버리고
*           그 조차 인지하지 못한다면 많이 난처할 것 같다. (뭐 근데 이런건 gpt 가 잘 잡음)
*           더욱 문제는, 런타임 에러면 참 좋겠는데 논리 오류라면 문제가 발생했는지도 모를거다.
*           Builder 는 이럴 일이 없다.
*
*           쉽게 비유를 해보자면, Setter는 집에서 된장찌개를 끓이고 있는 냄비와도 같다.
*           잠시 자리를 비운 사이, 룸메가 청양고추 안넣은거같다고 착각하고 때려박을 수도 있다.
*           Builder Pattern 은 배달음식과도 같다. 조리과정에 개입할 수 없다.
*           적어도, 실 사용하는 단계에서 데이터가 변절되는 일은 없을거라는 소리다.
*
*           본인은 데이터의 무결성 관점에 포커스를 맞춰 시나리오를 작성했으나, 트레이드 오프 사항 보면
*           작성할 수 있는 시나리오는 그 외에도 많다.
*
*           * https://skatpdnjs.tistory.com/13
*           * https://velog.io/@kjh1232100/Java-setter-vs-builder
*           * https://choihjhj.tistory.com/entry/jpa-JUnit-테스트시-Setter-대신-Builder-간편-사용
*
*     Ref3. 예외처리를 좀 더 세분화했다.
*
*           기존코드 ::
*               if (savedCode == null || !savedCode.equals(verificationCode)) {
                    throw new IllegalArgumentException("Invalid or expired verification code");
                }
*
*           이렇게 했을 떄, API 테스트 과정에서 인증코드가 불일치하는건지 Redis 에 저장이 안된건지 판단이 어려웠다.
*           이렇게 분리하면, 단순 잘못 입력인지 아니면 Redis 문제인지 쉽게 파악할 수 있다.
* */

