package com.example.teamproject2025.Service.ProfanityFilter;

import com.example.teamproject2025.config.ProfanityConfig;
import com.example.teamproject2025.service.ProfanityFilter.ProfanityFilterService;
import com.example.teamproject2025.service.ProfanityFilter.ProfanityFilterServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;

@SpringBootTest
@ContextConfiguration(classes = {ProfanityConfig.class, ProfanityFilterServiceImpl.class})
public class ProfanityFilterTest {

    @Autowired
    private ProfanityFilterService profanityFilterService;
    private static final int NUM_ITERATIONS = 1000; // 반복 횟수

    @Test
    public void testSingleExecutionPerformance() {
        System.out.println("\n\n===== 단일 실행 성능 테스트 =====");
        System.out.println("ProfanityFilterService: " + profanityFilterService); // Bean 주입 확인

        String[] texts = {
                "씨발병신좆같은개시발련이너나그렇잖아좆병신시발호로개병신머저리호구련아시발니가나한테해준게뭐가있다고날그렇게판단해서말해병신아",
                "고르곤졸라",
                "이거 해달라고 졸라봤어요",
                "근데 싫다길래 목을 졸라봤어요",
                "리조또",
                "조또마떼구다사이",
                "빌게이츠",
                "고추바사삭, 고추장, 풋고추",
                "보지마세요",
                "도망가"
        };

        for (String text : texts) {
            System.out.println("\n=== 테스트 문장: " + text);

            // 탐지 테스트
            long startTime = System.nanoTime();
            List<String> detectedWords = profanityFilterService.detectProfanity(text);
            long endTime = System.nanoTime();
            System.out.println("탐지 시간: " + (endTime - startTime) + " ns");
            System.out.println("탐지된 단어들: " + detectedWords);

            // 마스킹 테스트
            startTime = System.nanoTime();
            String maskedText = profanityFilterService.maskProfanity(text);
            endTime = System.nanoTime();
            System.out.println("마스킹 시간: " + (endTime - startTime) + " ns");
            System.out.println("마스킹된 텍스트: " + maskedText);
        }
    }

    @Test
    public void testPerformance() {
        System.out.println("===== 평균 성능 테스트 =====");
        String text = "물어봤으면시발새기야알려줄줄을알아야지병신같은새기가욕지거리야시발새기가뒤질라고미니어처는시발럼이저안에들어가고싶냐개좆같은호로병신색기나가뒤져시발놈아";

        // 탐지 테스트
        long totalDetectionTime = 0;
        for (int i = 0; i < NUM_ITERATIONS; i++) {
            long startTime = System.nanoTime();
            profanityFilterService.detectProfanity(text);
            long endTime = System.nanoTime();
            totalDetectionTime += (endTime - startTime);
        }
        double averageDetectionTimeNs = (double) totalDetectionTime / NUM_ITERATIONS;
        double averageDetectionTimeMs = averageDetectionTimeNs / 1_000_000;
        double averageDetectionTimeSec = averageDetectionTimeNs / 1_000_000_000;

        System.out.println("평균 탐지 시간: ");
        System.out.println(" - 나노초 (ns): " + averageDetectionTimeNs + " ns");
        System.out.println(" - 밀리초 (ms): " + averageDetectionTimeMs + " ms");
        System.out.println(" - 초 (sec): " + averageDetectionTimeSec + " sec");

        // 마스킹 테스트
        long totalMaskingTime = 0;
        for (int i = 0; i < NUM_ITERATIONS; i++) {
            long startTime = System.nanoTime();
            profanityFilterService.maskProfanity(text);
            long endTime = System.nanoTime();
            totalMaskingTime += (endTime - startTime);
        }
        double averageMaskingTimeNs = (double) totalMaskingTime / NUM_ITERATIONS;
        double averageMaskingTimeMs = averageMaskingTimeNs / 1_000_000;
        double averageMaskingTimeSec = averageMaskingTimeNs / 1_000_000_000;

        System.out.println("평균 마스킹 시간: ");
        System.out.println(" - 나노초 (ns): " + averageMaskingTimeNs + " ns");
        System.out.println(" - 밀리초 (ms): " + averageMaskingTimeMs + " ms");
        System.out.println(" - 초 (sec): " + averageMaskingTimeSec + " sec");
    }
}
