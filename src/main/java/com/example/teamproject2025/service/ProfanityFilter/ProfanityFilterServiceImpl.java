package com.example.teamproject2025.service.ProfanityFilter;

import lombok.RequiredArgsConstructor;
import org.ahocorasick.trie.Emit;
import org.ahocorasick.trie.Trie;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProfanityFilterServiceImpl implements ProfanityFilterService {

    private final Trie badWordTrie;
    private final Trie allowedWordTrie;
    private final Map<String, String> normalizationDict;

    public ProfanityFilterServiceImpl(
            @Qualifier("badWordTrie") Trie badWordTrie,
            @Qualifier("allowedWordTrie") Trie allowedWordTrie,
            Map<String, String> normalizationDict
    ) {
        this.badWordTrie = badWordTrie;
        this.allowedWordTrie = allowedWordTrie;
        this.normalizationDict = normalizationDict;
    }

    private String normalize(String input) {
        for (Map.Entry<String, String> entry : normalizationDict.entrySet()) {
            input = input.replace(entry.getKey(), entry.getValue());
        }
        return input;
    }

    @Override
    public List<String> detectProfanity(String input) {
        String normalized = normalize(input);

        List<Emit> badWords = new ArrayList<>(badWordTrie.parseText(normalized));
        List<Emit> allowedWords = new ArrayList<>(allowedWordTrie.parseText(normalized));

        Set<String> allowedWordsSet = new HashSet<>();
        for (Emit allowedWord : allowedWords) {
            allowedWordsSet.add(allowedWord.getKeyword());
        }

        List<String> detectedWords = new ArrayList<>();
        for (Emit badWord : badWords) {
            if (!allowedWordsSet.contains(badWord.getKeyword())) {
                detectedWords.add(badWord.getKeyword());
            }
        }

        return detectedWords;
    }

    @Override
    public String maskProfanity(String input) {
        String normalized = normalize(input);
        char[] chars = normalized.toCharArray();

        List<Emit> badWords = new ArrayList<>(badWordTrie.parseText(normalized));
        List<Emit> allowedWords = new ArrayList<>(allowedWordTrie.parseText(normalized));

        Set<Integer> allowedPositions = new HashSet<>();
        for (Emit allowedWord : allowedWords) {
            for (int i = allowedWord.getStart(); i <= allowedWord.getEnd(); i++) {
                allowedPositions.add(i);
            }
        }

        for (Emit badWord : badWords) {
            boolean isAllowed = true;
            for (int i = badWord.getStart(); i <= badWord.getEnd(); i++) {
                if (!allowedPositions.contains(i)) {
                    isAllowed = false;
                    break;
                }
            }
            if (!isAllowed) {
                for (int i = badWord.getStart(); i <= badWord.getEnd(); i++) {
                    chars[i] = '*';
                }
            }
        }

        return new String(chars);
    }
}

