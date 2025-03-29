package com.example.teamproject2025.service.User;

import com.example.teamproject2025.dto.User.BanUserResponseDto;
import com.example.teamproject2025.entity.User.BanUser;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Chat.ChatMessageRepository;
import com.example.teamproject2025.repository.User.BanUserRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BanUserServiceImpl implements BanUserService{
    private final UserRepository userRepository;
    private final BanUserRepository banUserRepository;
    private final ChatMessageRepository chatmessageRepository;

    @Override
    public BanUserResponseDto updateBanUserInfo(Long userId){
        // 1-step: Define User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 2-step: Count Bad messages User Sent
        Integer curBadMessagesCnt = chatmessageRepository.countBadMessagesByUser(user);

        // 3-step: Define Ban User
        Optional<BanUser> checkBanUser = banUserRepository.findByUser(user); // 없다고 에러 내서는 안됨
        if (checkBanUser.isEmpty()){ return new BanUserResponseDto(); }
        BanUser banUser = checkBanUser.get();

        Integer prevBadMessages = banUser.getPrevBadMessagesCnt();
        int newBadMessages = curBadMessagesCnt - prevBadMessages;

        // 4-step: Calc Ban Days;
        int banDays = 0;
        LocalDate today = LocalDate.now();
        // test set: 2,4,6
        if (newBadMessages >= 6){ banDays = 30;}
        else if (newBadMessages >= 4){ banDays = 21;}
        else if (newBadMessages >= 2){ banDays = 14;}

        // 5-step: toEntity, toDTO
        BanUserResponseDto banUserDto = BanUserResponseDto.toDTO(user, today.plusDays(banDays), curBadMessagesCnt);
        BanUser banUserEntity = BanUserResponseDto.toEntity(user, today.plusDays(banDays), curBadMessagesCnt);

        // 6-step: Save and Return
        banUserRepository.save(banUserEntity);
        return banUserDto;
    }
}
