package com.example.teamproject2025.service.Chat;

import com.example.teamproject2025.dto.Chat.ChatMessageReqDto;
import com.example.teamproject2025.dto.Chat.ChatRoomListResDto;
import com.example.teamproject2025.dto.Chat.ChatRoomParticipantsReqDto;
import com.example.teamproject2025.dto.Chat.MyChatListResDto;
import com.example.teamproject2025.entity.Chat.ChatRoom;
import com.example.teamproject2025.entity.User.User;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface ChatService {
    void saveMessage(Long roomId, ChatMessageReqDto chatMessageReqDto, Boolean isBadWord);
    void createGroupRoom(String chatRoomName , HttpServletRequest request);
    List<ChatRoomListResDto> getGroupchatRooms();
    void addParticipantToGroupChat(Long roomId, HttpServletRequest request);
    void addParticipantToRoom(ChatRoom chatRoom, User user);
    List<ChatMessageReqDto> getChatHistory(Long roomId, HttpServletRequest request);
    boolean isRoomParticipant(String email, Long roomId);
    void messageRead(Long roomId, HttpServletRequest request);
    List<MyChatListResDto> getMyChatRooms(HttpServletRequest request);
    void leaveGroupChatRoom(Long roomId, HttpServletRequest request);
    void leavePrivateChatRoom(Long roomId, HttpServletRequest request);
    Long getOrCreatePrivateRoom(Long otherUserId, Long clubId, HttpServletRequest request);
    List<ChatRoomParticipantsReqDto> getRoomUsers(Long roomId);
    List<MyChatListResDto> getMyChatRoomsByUser(User user);
    void leavePrivateChatRoomInternal(ChatRoom chatRoom, User user);
    String getRoomName(Long roomId);
}
