package com.example.teamproject2025.repository.Chat;

import com.example.teamproject2025.entity.Chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByIsGroupChat(Boolean isGroupChat);
    @Query("SELECT cr FROM ChatRoom cr " +
            "JOIN ChatParticipant cp1 ON cp1.chatRoom = cr AND cp1.user.userId = :userId " +
            "JOIN ChatParticipant cp2 ON cp2.chatRoom = cr AND cp2.user.userId = :otherUserId " +
            "WHERE cr.isGroupChat = false AND cr.clubId = :clubId")
    Optional<ChatRoom> findExistingPrivateRoom(Long userId, Long otherUserId, Long clubId);
    List<ChatRoom> findChatRoomsByClubId(Long clubId);
    Optional<ChatRoom> findChatRoomByClubId(Long clubId);
}