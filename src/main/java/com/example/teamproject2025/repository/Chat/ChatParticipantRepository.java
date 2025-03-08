package com.example.teamproject2025.repository.Chat;

import com.example.teamproject2025.entity.Chat.ChatParticipant;
import com.example.teamproject2025.entity.Chat.ChatRoom;
import com.example.teamproject2025.entity.User.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Long> {
    List<ChatParticipant> findByChatRoom(ChatRoom chatRoom);
    Optional<ChatParticipant> findByChatRoomAndUser(ChatRoom chatRoom, User user);
    List<ChatParticipant> findAllByUser(User user);

    @Query("SELECT cp1.chatRoom FROM ChatParticipant cp1 JOIN ChatParticipant cp2 ON cp1.chatRoom.id = cp2.chatRoom.id WHERE cp1.user.userId = :myId AND cp2.user.userId = :otherUserId AND cp1.chatRoom.isGroupChat = false")
    Optional<ChatRoom> findExistingPrivateRoom(@Param("myId") Long myId, @Param("otherUserId") Long otherUserId);
}
