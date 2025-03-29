package com.example.teamproject2025.service.ProfanityFilter;

import lombok.RequiredArgsConstructor;
import org.ahocorasick.trie.Emit;
import org.ahocorasick.trie.Trie;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfanityFilterServiceImpl implements ProfanityFilterService {

    private final Trie trie; // ProfanityConfig 에 Bean 등록해뒀음 => buildTrie 되어있는 상황
    private final Map<String, String> normalizationDict;

    private String normalize(String input) {
        for (Map.Entry<String, String> entry : normalizationDict.entrySet()) {
            input = input.replace(entry.getKey(), entry.getValue());
        }
        return input;
    }

    @Override
    public List<String> detectProfanity(String input) {
        String normalized = normalize(input);
        List<String> detected = new ArrayList<>();

        for (Emit emit : trie.parseText(normalized)) {
            detected.add(emit.getKeyword());
        }

        return detected;
    }

    @Override
    public String maskProfanity(String input) {
        String normalized = normalize(input);
        char[] chars = normalized.toCharArray();

        for (Emit emit : trie.parseText(normalized)) {
            int start = emit.getStart();
            int end = emit.getEnd();

            for (int i = start; i <= end; i++) {
                chars[i] = '*';
            }
        }
        return new String(chars);
    }
}
