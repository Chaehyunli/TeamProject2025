package com.example.teamproject2025.repository.Auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class RedisEmailVerificationRepository {

    private final StringRedisTemplate redisTemplate;
    public RedisEmailVerificationRepository(@Qualifier("emailVerification") StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private static final long EXPIRATION_TIME = 5; // 20분 TTL 설정

    // 인증번호 저장 (email -> verificationCode)
    public void saveVerificationCode(String email, String verificationCode) {
        redisTemplate.opsForValue().set(email, verificationCode, EXPIRATION_TIME, TimeUnit.MINUTES);
    }

    // 인증번호 조회
    public String getVerificationCode(String email) {
        return redisTemplate.opsForValue().get(email);
    }

    // 인증번호 삭제
    public void deleteVerificationCode(String email) {
        redisTemplate.delete(email);
    }
}
