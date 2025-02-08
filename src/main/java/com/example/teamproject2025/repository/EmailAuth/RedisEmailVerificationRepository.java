package com.example.teamproject2025.repository.EmailAuth;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class RedisEmailVerificationRepository {
    // Redis -> 인증 토큰 저장 & 만료 설정, 토큰을 키로 사용하고 이메일을 값으로 저장

    private final StringRedisTemplate redisTemplate;
    private static final long EXPIRATION_TIME = 20; // 20분 후 자동 삭제

    private static final String TOKEN_HASH_KEY = "dkwkdkwkghkdlxld"; // Key: 아자아자화이팅

    // Token 을 TTL (Time To Live -> 생명주기) 적용해서 저장

    public void saveToken(String token, String email) {
        HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();
        hashOps.put(TOKEN_HASH_KEY, token, email);
        redisTemplate.expire(TOKEN_HASH_KEY, EXPIRATION_TIME, TimeUnit.MINUTES); // TTL 설정
    }

    public String getEmailByToken(String token) {
        HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();
        return hashOps.get(TOKEN_HASH_KEY, token);
    }

    public void deleteToken(String token) {
        HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();
        hashOps.delete(TOKEN_HASH_KEY, token);
    }

    public void deleteAllTokens() { // Admin 관점에서 모든 토큰 삭제를 할 일이 올 수도 있음
        redisTemplate.delete(TOKEN_HASH_KEY);
    }
}
