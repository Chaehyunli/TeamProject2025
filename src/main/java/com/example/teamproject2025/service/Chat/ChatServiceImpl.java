package com.example.teamproject2025.service.Chat;

import com.example.teamproject2025.dto.Chat.ChatMessageReqDto;
import com.example.teamproject2025.dto.Chat.ChatRoomListResDto;
import com.example.teamproject2025.dto.Chat.ChatRoomParticipantsReqDto;
import com.example.teamproject2025.dto.Chat.MyChatListResDto;
import com.example.teamproject2025.entity.Chat.ChatMessage;
import com.example.teamproject2025.entity.Chat.ChatParticipant;
import com.example.teamproject2025.entity.Chat.ChatRoom;
import com.example.teamproject2025.entity.Chat.ReadStatus;
import com.example.teamproject2025.entity.User.User;
import com.example.teamproject2025.repository.Chat.ChatMessageRepository;
import com.example.teamproject2025.repository.Chat.ChatParticipantRepository;
import com.example.teamproject2025.repository.Chat.ChatRoomRepository;
import com.example.teamproject2025.repository.Chat.ReadStatusRepository;
import com.example.teamproject2025.repository.User.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ReadStatusRepository readStatusRepository;
    private final UserRepository userRepository;

    // ✅ 세션에서 현재 로그인된 사용자 가져오기
    private User getSessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            throw new AuthenticationServiceException("세션이 존재하지 않습니다. 로그인 후 다시 시도하세요.");
        }

        Long userId = (Long) session.getAttribute("userId"); // ✅ userId를 가져옴

        if (userId == null) {
            throw new AuthenticationServiceException("로그인된 사용자가 없습니다. 다시 로그인해주세요.");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationServiceException("세션에 저장된 사용자 정보를 찾을 수 없습니다."));
    }

    @Override
    public void saveMessage(Long roomId, ChatMessageReqDto chatMessageReqDto){
        //  채팅방 조회: Path Parameter 로 roomId 가 딸려오게 됨
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()-> new EntityNotFoundException("room cannot be found"));

        //  보낸사람조회 : sender local storage 속 자신의 email 정보와 함꼐 메시지를 보내면 chatMessageReqDto 가 그걸 받음
        User sender = userRepository.findByEmail(chatMessageReqDto.getSenderEmail())
                .orElseThrow(() -> {
                    System.out.println("❌ No user found with email: " + chatMessageReqDto.getSenderEmail());
                    return new EntityNotFoundException("user cannot be found");
                });

        // 메시지저장
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .user(sender)
                .content(chatMessageReqDto.getMessage())
                .build();

        chatMessageRepository.save(chatMessage);

        // 사용자별로 읽음여부 저장
        List<ChatParticipant> chatParticipants = chatParticipantRepository.findByChatRoom(chatRoom);
        for(ChatParticipant c : chatParticipants){
            ReadStatus readStatus = ReadStatus.builder()
                    .chatRoom(chatRoom)
                    .user(c.getUser())
                    .chatMessage(chatMessage)
                    .isRead(c.getUser().equals(sender))
                    .build();
            readStatusRepository.save(readStatus);
        }
    }

    @Override
    public void createGroupRoom(String chatRoomName , HttpServletRequest request){
        User user = getSessionUser(request);

        // 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .name(chatRoomName)
                .isGroupChat(true)
                .build();
        chatRoomRepository.save(chatRoom);

        // 채팅참여자로 개설자를 추가
        ChatParticipant chatParticipant = ChatParticipant.builder()
                .chatRoom(chatRoom)
                .user(user)
                .build();
        chatParticipantRepository.save(chatParticipant);
    }

    @Override
    public List<ChatRoomListResDto> getGroupchatRooms(){
        List<ChatRoom> chatRooms = chatRoomRepository.findByIsGroupChat(true);
        List<ChatRoomListResDto> dtos = new ArrayList<>();
        for(ChatRoom c : chatRooms){
            ChatRoomListResDto dto = ChatRoomListResDto
                    .builder()
                    .roomId(c.getId())
                    .roomName(c.getName())
                    .build();
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public void addParticipantToGroupChat(Long roomId, HttpServletRequest request){
        // 채팅방조회
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()-> new EntityNotFoundException("room cannot be found"));

        //user조회
        User user = getSessionUser(request);

        if(chatRoom.getIsGroupChat().equals(false)){
            throw new IllegalArgumentException("그룹채팅이 아닙니다.");
        }

        // 이미 참여자인지 검증
        Optional<ChatParticipant> participant = chatParticipantRepository.findByChatRoomAndUser(chatRoom, user);
        if(!participant.isPresent()){
            addParticipantToRoom(chatRoom, user);
        }
    }

    // ChatParticipant 객체 생성 후 저장
    @Override
    public void addParticipantToRoom(ChatRoom chatRoom, User user){
        ChatParticipant chatParticipant = ChatParticipant.builder()
                .chatRoom(chatRoom)
                .user(user)
                .build();
        chatParticipantRepository.save(chatParticipant);
    }

    @Override
    public List<ChatMessageReqDto> getChatHistory(Long roomId, HttpServletRequest request){
        // 내가 해당 채팅방의 참여자가 아닐경우 에러
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()-> new EntityNotFoundException("room cannot be found"));
        User user = getSessionUser(request);

        List<ChatParticipant> chatParticipants = chatParticipantRepository.findByChatRoom(chatRoom);
        boolean check = false;
        for(ChatParticipant c : chatParticipants){
            if(c.getUser().equals(user)){
                check = true;
            }
        }

        if(!check)throw new IllegalArgumentException("본인이 속하지 않은 채팅방입니다.");

        // 특정 room에 대한 message조회
        List<ChatMessage> chatMessages = chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom);
        List<ChatMessageReqDto> chatMessageDtos = new ArrayList<>();
        for(ChatMessage c : chatMessages){
            ChatMessageReqDto chatMessageDto = ChatMessageReqDto.builder()
                    .message(c.getContent())
                    .senderEmail(c.getUser().getEmail())
                    .createdAt(c.getCreatedAt().toString())
                    .build();
            chatMessageDtos.add(chatMessageDto);
        }
        return chatMessageDtos;
    }

    @Override
    public boolean isRoomParticipant(String email, Long roomId){
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()-> new EntityNotFoundException("room cannot be found"));
        User user = (User) userRepository.findByEmail(email).orElseThrow(()->new EntityNotFoundException("user cannot be found"));

        List<ChatParticipant> chatParticipants = chatParticipantRepository.findByChatRoom(chatRoom);
        for(ChatParticipant c : chatParticipants){
            if(c.getUser().equals(user)){
                return true;
            }
        }
        return false;
    }

    @Override
    public void messageRead(Long roomId, HttpServletRequest request){
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()-> new EntityNotFoundException("room cannot be found"));
        User user = getSessionUser(request);

        List<ReadStatus> readStatuses = readStatusRepository.findByChatRoomAndUser(chatRoom, user);
        for(ReadStatus r : readStatuses){
            r.updateIsRead(true);
        }
    }

    @Override
    public List<MyChatListResDto> getMyChatRooms(HttpServletRequest request){
        User user = getSessionUser(request);

        List<ChatParticipant> chatParticipants = chatParticipantRepository.findAllByUser(user);
        List<MyChatListResDto> chatListResDtos = new ArrayList<>();
        for(ChatParticipant p : chatParticipants){
            Long count = readStatusRepository.countByChatRoomAndUserAndIsReadFalse(p.getChatRoom(), user);
            MyChatListResDto dto = MyChatListResDto.builder()
                    .roomId(p.getChatRoom().getId())
                    .roomName(p.getChatRoom().getName()) // ChatRoom Name 을 Participant 의 User Name 으로 지정해버리면?
                    .isGroupChat(p.getChatRoom().getIsGroupChat())
                    .unReadCount(count)
                    .updatedAt(p.getChatRoom().getUpdatedAt().toString())
                    .build();
            chatListResDtos.add(dto);
        }
        return chatListResDtos;
    }

    public List<MyChatListResDto> getMyChatRoomsByUser(User user){
        List<ChatParticipant> chatParticipants = chatParticipantRepository.findAllByUser(user);
        List<MyChatListResDto> chatListResDtos = new ArrayList<>();

        for(ChatParticipant p : chatParticipants){
            MyChatListResDto dto = MyChatListResDto.builder()
                    .roomId(p.getChatRoom().getId())
                    .isGroupChat(p.getChatRoom().getIsGroupChat())
                    .build();
            chatListResDtos.add(dto);
        }
        return chatListResDtos;
    }


    @Override
    public void leaveGroupChatRoom(Long roomId, HttpServletRequest request){
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()-> new EntityNotFoundException("room cannot be found"));
        User user = getSessionUser(request);

        if(chatRoom.getIsGroupChat().equals(false)){
            throw new IllegalArgumentException("단체 채팅방이 아닙니다.");
        }
        ChatParticipant c = chatParticipantRepository.findByChatRoomAndUser(chatRoom, user).orElseThrow(()->new EntityNotFoundException("참여자를 찾을 수 없습니다."));
        chatParticipantRepository.delete(c);

        List<ChatParticipant> chatParticipants = chatParticipantRepository.findByChatRoom(chatRoom);
        if(chatParticipants.isEmpty()){
            chatRoomRepository.delete(chatRoom);
        }
    }

    @Override
    public void leavePrivateChatRoom(Long roomId, HttpServletRequest request){
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()-> new EntityNotFoundException("room cannot be found"));
        User user = getSessionUser(request);

        if(chatRoom.getIsGroupChat().equals(true)){
            throw new IllegalArgumentException("개인 채팅방이 아닙니다.");
        }
        ChatParticipant c = chatParticipantRepository.findByChatRoomAndUser(chatRoom, user).orElseThrow(()->new EntityNotFoundException("참여자를 찾을 수 없습니다."));
        chatParticipantRepository.delete(c);

        List<ChatParticipant> chatParticipants = chatParticipantRepository.findByChatRoom(chatRoom);
        if(chatParticipants.isEmpty()){
            chatRoomRepository.delete(chatRoom);
        }
    }

    @Override
    public Long getOrCreatePrivateRoom(Long otherUserId, HttpServletRequest request){
        User user = getSessionUser(request);

        User otherUser = userRepository.findById(otherUserId).orElseThrow(()->new EntityNotFoundException("user cannot be found"));

        // 나와 상대방이 1:1채팅에 이미 참석하고 있다면 해당 roomId return
        Optional<ChatRoom> chatRoom = chatParticipantRepository.findExistingPrivateRoom(user.getUserId(), otherUser.getUserId());

        if(chatRoom.isPresent()){
            return chatRoom.get().getId();
        }

        // 만약에 1:1채팅방이 없을경우 기존 채팅방 개설
        ChatRoom newRoom = ChatRoom.builder()
                .isGroupChat(false)
                .name(user.getName() + "-" + otherUser.getName())
                .build();

        chatRoomRepository.save(newRoom);

        // 두사람 모두 참여자로 새롭게 추가
        addParticipantToRoom(newRoom, user);
        addParticipantToRoom(newRoom, otherUser);

        return newRoom.getId();
    }

    @Override
    public List<ChatRoomParticipantsReqDto> getRoomUsers(Long roomId){
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(()->new EntityNotFoundException("room cannot be found"));
        List<ChatParticipant> chatParticipants = chatParticipantRepository.findByChatRoom(chatRoom);
        List<ChatRoomParticipantsReqDto> dtos = new ArrayList<>();

        log.info("ChatRoom ID: {}", chatRoom.getId());
        log.info("Participants count: {}", chatParticipants.size());

        for (ChatParticipant p : chatParticipants){
            ChatRoomParticipantsReqDto dto = ChatRoomParticipantsReqDto.builder()
                    .email(p.getUser().getEmail())
                    .name(p.getUser().getName())
                    .profileImage(p.getUser().getProfileImage())
                    .build();
            dtos.add(dto);
        }
        return dtos;
    }
}
