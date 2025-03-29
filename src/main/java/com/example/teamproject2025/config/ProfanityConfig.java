package com.example.teamproject2025.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.Cache;
import org.ahocorasick.trie.Trie;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Configuration
public class ProfanityConfig {
    // ✅ JSON 파일에서 Normalization Dict 로드
    @Bean(name = "normalizationDict")
    public Map<String, String> normalizationDict() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = new ClassPathResource("normalization_dict.json").getInputStream();
        return mapper.readValue(is, new TypeReference<Map<String, String>>() {});
    }

    // ✅ JSON 파일에서 Bad Words 로드
    @Bean(name = "badWords")
    public List<String> badWords() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = new ClassPathResource("merged_badwords.json").getInputStream();
        Map<String, List<String>> json = mapper.readValue(is, new TypeReference<>() {});
        return json.get("words");
    }

    // ✅ Caffeine Cache 설정
    @Bean
    public Cache<String, Trie> trieCache() {
        return Caffeine.newBuilder()
                .maximumSize(10)                           // 캐시 최대 크기 설정 (10개의 Trie까지 저장 가능)
                .expireAfterWrite(60, TimeUnit.MINUTES)    // 60분 후 캐시 만료
                .build();
    }

    // ✅ Trie 빌드 메서드 (Caffeine Cache 적용)
    @Bean
    public Trie buildTrie(List<String> badWords, Cache<String, Trie> trieCache) {
        Trie cachedTrie = trieCache.getIfPresent("trie"); // 캐시에서 Trie 조회
        if (cachedTrie != null) {
            return cachedTrie; // 캐시된 Trie 사용
        }

        // 새로 빌드하는 경우
        Trie.TrieBuilder builder = Trie.builder().ignoreCase();
        for (String word : badWords) {
            builder.addKeyword(word);
        }
        Trie newTrie = builder.build();

        trieCache.put("trie", newTrie); // 캐시에 저장

        return newTrie;
    }
}
