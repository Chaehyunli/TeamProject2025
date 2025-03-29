package com.example.teamproject2025.repository.Chat;

import com.example.teamproject2025.entity.Chat.ChatMessage;
import com.example.teamproject2025.entity.Chat.ChatRoom;
import com.example.teamproject2025.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoom);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.user = :user AND m.isBadWord = true")
    Integer countBadMessagesByUser(@Param("user") User user);
}
