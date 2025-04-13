package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.User.BanUserResponseDto;
import com.example.teamproject2025.entity.User.BanUser;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Chat.ChatMessageRepository;
import com.example.teamproject2025.repository.User.BanUserRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class BanUserServiceImpl implements BanUserService {

    private final UserRepository userRepository;
    private final BanUserRepository banUserRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public BanUserResponseDto updateBanUserInfo(Long userId) {
        // 1-step: Define User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 2-step: Count Bad messages
        int curBadMessages = chatMessageRepository.countBadMessagesByUser(user);

        // 3-step: Define banUser
        BanUser banUser = banUserRepository.findByUser(user).orElse(null);

        // 4-step: Count newBadMessages
        LocalDate today = LocalDate.now();
        if (banUser != null && today.isBefore(banUser.getAllowedLoginDate())) {
            System.out.println("✅ 기존 제재가 유효하므로 업데이트 없이 정보 반환");
            return BanUserResponseDto.toDTO(banUser.getId(), banUser.getAllowedLoginDate(), banUser.getPrevBadMessagesCnt());
        }
        int prevBadMessages = (banUser != null) ? banUser.getPrevBadMessagesCnt() : 0;
        int newBadMessages = curBadMessages - prevBadMessages;

        // 5-step: Calc Ban Days
        int banDays = calculateBanDays(newBadMessages);
        LocalDate allowedLoginDate = LocalDate.now().plusDays(banDays);


        // ✅ 새로운 제재일이 오늘 이후일 때만 저장
        if (banDays > 0) {
            BanUser banUserEntity = BanUserResponseDto.toEntity(
                    (banUser != null) ? banUser.getId() : null,
                    user,
                    allowedLoginDate,
                    curBadMessages
            );
            banUserRepository.save(banUserEntity);
            System.out.println("✅ BanUser 저장 또는 업데이트 완료");
            return BanUserResponseDto.toDTO(banUserEntity.getId(), allowedLoginDate, curBadMessages);
        } else {
            System.out.println("❌ 제재 대상이 아니므로 BanUser 저장하지 않음");
            return BanUserResponseDto.toDTO(
                    (banUser != null) ? banUser.getId() : null,  // ✅ null 안전 처리
                    today,
                    curBadMessages
            );
        }
    }

    private int calculateBanDays(int newBadMessages) {
        if (newBadMessages >= 15) return 30;
        if (newBadMessages >= 10) return 21;
        if (newBadMessages >= 5) return 14;
        return 0;
    }
}
