package com.example.teamproject2025.service.Chat;

import com.example.teamproject2025.dto.Chat.ChatMessageReqDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
public class RedisPubSubService implements MessageListener {

    private final StringRedisTemplate chatRedisTemplate;
    private final SimpMessageSendingOperations messageTemplate;

    /* 이건 RequiredArgsConstructor 가 필드에 직접 추가된 어노테이션을 생성자에 복사하지 않아서
       @Qualifer 를 실행할 수 없다. 따라서, 생성자를 직접 주입한다. */

    public RedisPubSubService(
            @Qualifier("chatPubSub") StringRedisTemplate chatRedisTemplate,
            SimpMessageSendingOperations messageTemplate
    ) {
        this.chatRedisTemplate = chatRedisTemplate;
        this.messageTemplate = messageTemplate;
    }

    public void publish(String channel, String message){
        chatRedisTemplate.convertAndSend(channel, message);
    }

    @Override
    // pattern 에는 topic 의 이름의 패턴이 담겨있고, 이 패턴을 기반으로 다이나믹한 코딩
    public void onMessage(Message message, byte[] pattern) {
        String payload = new String(message.getBody());
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            ChatMessageReqDto chatMessageDto = objectMapper.readValue(payload, ChatMessageReqDto.class);
            messageTemplate.convertAndSend("/topic/"+chatMessageDto.getRoomId(), chatMessageDto);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
