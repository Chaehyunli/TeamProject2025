package com.example.teamproject2025.Service.EmailAuth;

import com.example.teamproject2025.service.EmailAuth.EmailService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class EmailServiceTest {

    @Autowired
    private JavaMailSender mailSender;

    @Test
    void sendEmailTest() {
        // Given
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("kth1322@naver.com"); // 받는 사람 이메일
        message.setSubject("Test Email: Spring Boot"); // 이메일 제목
        message.setText("호에에에에에ㅔ에에에에에에엥"); // 이메일 본문

        // When
        mailSender.send(message);

        // Then
        System.out.println("Email sent successfully.");
    }

//    @Autowired
//    private EmailService emailService;  // @RequiredArgsConstructor 사용 유지
//
//    @MockitoBean
//    private JavaMailSender mailSender; // JavaMailSender를 Mocking -> 실제로 전송되진 않음
//
//    @Test
//    void sendEmailTest() {
//        // Given
//        String to = "kth1322@naver.com";
//        String subject = "Test Email: Spring Boot";
//        String text = "호에에에에에ㅔ에에에에에에엥";
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(text);
//
//        doNothing().when(mailSender).send(any(SimpleMailMessage.class));  // Mock 설정
//
//        // When
//        emailService.sendEmail(to, subject, text);  // EmailService의 메서드 실행
//
//        // Then
//        verify(mailSender, times(1)).send(any(SimpleMailMessage.class)); // send가 호출되었는지 검증
//    }
}

/* ⚠️ Issue : @Autowired 로 하면 mailSender 에 Inspection 어쩌구가 뜸
*   Inspection 'Incorrect autowiring in Spring bean components' has no quick-fixes for this problem.
    Click to edit inspection options, suppress the warning, or disable the inspection completely.
* */

/* ⚠️ Issue : test 환경에서는 RequiredArgsConstructor 를 인식하지 못함
*
* 원인 : Lombok Librariy 가 test module (class path) 에 포함되지 않음
* 해결 ✅ ::
*   Test 를 위한 Lombok dependencies 추가 했음
*   추가로, 라이브러리를 카테고리별로 정돈했음
* */

/* ⚠️ Issue : Authentication 이 안됨.
* 추정 원인 : application.properties 에서 이메일과 앱 비밀번호를 제대로 인증하지 못하는 것 같음
* 가설 ::
*   보통 앱 비밀번호가 aaaa bbbb cccc dddd 형식임 -> env 파일에 그 형식 그대로 저장됨
*   그렇다면, 이 공백이 문제가 되는게 아닐까?
* 해결 ✅ ::
*   smtp.env 의 내용을 aaaa bbbb cccc dddd -> aaaabbbbccccdddd 형식으로 바꿈
*   정상 작동 확인 (@Autowired 로 처리했을 때)
* */

/* ⚠️ Issue : RequiredArgsConstructor 환경으로 처리 시도해보면 에러가 발생함
*   추정 원인 : Spring IoC Container 에 Spring Bean 으로 등록 안된거같음 -> 주입이 안되고 있다고 판단
*
*   해결 ✅ :: Autowired 로 처리 -> 추정이 틀렸음을 반증 (∵ IoC 에서 가져오는걸 성공했다는거니까)
* */

/* 💡Descriptions : @Autowired vs @RequiredArgsConstructor
*
* @Autowired (필드 주입 방식) ::
*   How to DI? -> 런타임에 주입함
*              -> Spring Container : 객체 생성
*              -> @Autowired 가 붙은 필드 찾는다
*                 -> Bean 찾음 -> Reflection -> DI directly
*   Notice -> final ❌ (∵ Reflection)
*          -> Constructor 필수 ❌ (∵ DI directly)
*          -> 의존성을 Spring 내부에서 자동 처리 -> 개발자가 객체 생성 신경 안씀
*
* @RequiredArgsConstructor (생성자 주입 방식) ::
*   How to DI? -> Lombok 이 Compile Time 에 자동으로 생성자 생성
*              -> final 혹은 @NonNull 이 붙은 필드 대상으로 Custom Constructor 생성
*              -> 생성자 주입 -> Spring Container 가 객체를 생성 시 Constructor 호출해서 의존성 주입해야 함
*
*   Spring 의 권장 방식은 생성자 주입 방식임
*
* -> EmailService 에서 RequiredArgsConstructor 를 적용했으므로, 이를 그대로 가져와주면 될 듯
* -> Test 니까 JavaMailSender는 Mock 으로 설정 (∵ 혹시 모를 CI/CD Issue)
* -> EmailService 주입. 근데 이떄 @Autowired 를 Annotate 할건데,
     왜냐하면 Test Class 는 Spring 이 관리하는 Bean 이 아니라서
     @RequiredArgsConstructor 를 사용해도 자동으로 주입이 안됨.
     RequiredArgsConstructor 써봤자 안되는 이유가 이거 때문임

     그래서 Spring ApplicationContext(IoC) 에서 Bean 을 가져오려고 @Autowired 를 쓰는거임
* */

/* ⚠️ Issue : OpenJDK 64-bit Server VM warning 에러
* Error Meesage ::
*   OpenJDK 64-bit Server VM warning:
*   Sharing is only supported for boot loader classes
*   because bootstrap classpath has been appended
*
* 이게 뭔데? Java 8 이상의 버전에서 나타나는 경고메시지임 -> 심각한가?
*   실 작동 시, 저런 에러 메시지가 발생했어도 이메일이 정상적으로 오는 것을 확인
*   개발 관련 커뮤니티에서도 심각한 오류는 아니므로 무시해도 함 -> 경고 비활성홯하면 해결
*
* 해결 ✅ :: build.gradle 에서 다음과 같은 코드 삽입
*   tasks.named('test') {
    useJUnitPlatform()
    jvmArgs '-Xshare:off' // JVM 아규먼트 설정
    }
*
* */