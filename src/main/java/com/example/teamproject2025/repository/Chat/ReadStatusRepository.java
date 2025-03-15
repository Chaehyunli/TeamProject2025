package com.example.teamproject2025.repository.Chat;

import com.example.teamproject2025.entity.Chat.ChatRoom;
import com.example.teamproject2025.entity.Chat.ReadStatus;
import com.example.teamproject2025.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadStatusRepository extends JpaRepository<ReadStatus, Long> {
    List<ReadStatus> findByChatRoomAndUser(ChatRoom chatRoom, User user);
    Long countByChatRoomAndUserAndIsReadFalse(ChatRoom chatRoom, User user);
}