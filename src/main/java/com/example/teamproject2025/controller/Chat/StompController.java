package com.example.teamproject2025.controller.Chat;

import com.example.teamproject2025.dto.Chat.ChatMessageReqDto;
import com.example.teamproject2025.service.Chat.ChatService;
import com.example.teamproject2025.service.Chat.RedisPubSubService;
import com.example.teamproject2025.service.ProfanityFilter.ProfanityFilterService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class StompController {

    private final SimpMessageSendingOperations messageTemplate;
    private final ChatService chatService;
    private final RedisPubSubService chatPubSubService;
    private final ProfanityFilterService profanityFilterService;

    @MessageMapping("/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId, ChatMessageReqDto chatMessageReqDto) throws JsonProcessingException {
        System.out.println(chatMessageReqDto.getMessage());

        chatMessageReqDto.setCreatedAt(LocalDateTime.now().toString());

        // ProfanityFilter
        List<String> detectedWords = profanityFilterService.detectProfanity(chatMessageReqDto.getMessage());

        // Masking
        String maskedMessage = profanityFilterService.maskProfanity(chatMessageReqDto.getMessage());

        Boolean isBadWord = !detectedWords.isEmpty() && !maskedMessage.equals(chatMessageReqDto.getMessage());
        chatMessageReqDto.setMessage(maskedMessage); // update a masked message

        // Send Filtered Message & Boolean Value
        chatService.saveMessage(roomId, chatMessageReqDto, isBadWord);  // saveMessage() 파라미터 수정

        chatMessageReqDto.setRoomId(roomId);

        ObjectMapper objectMapper = new ObjectMapper();
        String message = objectMapper.writeValueAsString(chatMessageReqDto); // StompChatPage 에서 messages 에 저장될거임
        chatPubSubService.publish("chat", message);
    }
}
