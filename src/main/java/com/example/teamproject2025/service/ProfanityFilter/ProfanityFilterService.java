package com.example.teamproject2025.service.ProfanityFilter;

import java.util.List;

public interface ProfanityFilterService {
    String maskProfanity(String input);
    List<String> detectProfanity(String input);
}
