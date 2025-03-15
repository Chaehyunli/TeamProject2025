package com.example.teamproject2025.controller.Chat;

import com.example.teamproject2025.dto.Chat.ChatMessageReqDto;
import com.example.teamproject2025.service.Chat.ChatService;
import com.example.teamproject2025.service.Chat.RedisPubSubService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class StompController {

    private final SimpMessageSendingOperations messageTemplate;
    private final ChatService chatService;
    private final RedisPubSubService chatPubSubService;

    @MessageMapping("/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId, ChatMessageReqDto chatMessageReqDto) throws JsonProcessingException {
        System.out.println(chatMessageReqDto.getMessage());

        chatMessageReqDto.setCreatedAt(LocalDateTime.now().toString());

        chatService.saveMessage(roomId, chatMessageReqDto);
        chatMessageReqDto.setRoomId(roomId);

        ObjectMapper objectMapper = new ObjectMapper();
        String message = objectMapper.writeValueAsString(chatMessageReqDto); // StompChatPage 에서 messages 에 저장될거임
        chatPubSubService.publish("chat", message);
    }
}
