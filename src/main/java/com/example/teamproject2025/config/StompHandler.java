package com.example.teamproject2025.config;

import com.example.teamproject2025.service.Chat.ChatService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    @Value("${jwt.secretKey}")
    private String secretKey;
    private final ChatService chatService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        final StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT == accessor.getCommand()) {
            HttpSession session = (HttpSession) accessor.getSessionAttributes().get("session");
            if (session == null || session.getAttribute("user") == null) {
                throw new AuthenticationServiceException("세션이 만료되었습니다.");
            }
        }
        if (StompCommand.SUBSCRIBE == accessor.getCommand()) {
            System.out.println("subscribe 검증");

            HttpSession session = (HttpSession) accessor.getSessionAttributes().get("session");
            if (session == null || session.getAttribute("user") == null) {
                throw new AuthenticationServiceException("세션이 만료되었습니다.");
            }

            String email = (String) session.getAttribute("user");
            String roomId = accessor.getDestination().split("/")[2];

            if (!chatService.isRoomParticipant(email, Long.parseLong(roomId))) {
                throw new AuthenticationServiceException("해당 room에 권한이 없습니다.");
            }
        }

        return message;
    }
}
