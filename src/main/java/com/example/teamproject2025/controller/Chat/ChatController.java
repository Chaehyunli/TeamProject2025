package com.example.teamproject2025.controller.Chat;
import com.example.teamproject2025.dto.Chat.ChatMessageReqDto;
import com.example.teamproject2025.dto.Chat.ChatRoomListResDto;
import com.example.teamproject2025.dto.Chat.ChatRoomParticipantsReqDto;
import com.example.teamproject2025.dto.Chat.MyChatListResDto;
import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.service.Chat.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    // 그룹채팅방 개설
    @PostMapping("/room/group/create")
    public ResponseEntity<CommonResponseDto<Object>> createGroupRoom(@RequestParam String roomName, HttpServletRequest request){
        chatService.createGroupRoom(roomName, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Create Group Room", null));
    }

    // 그룹채팅목록조회
    @GetMapping("/room/group/list")
    public ResponseEntity<CommonResponseDto<List<ChatRoomListResDto>>> getGroupChatRooms(){
        List<ChatRoomListResDto> chatRooms = chatService.getGroupchatRooms();
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Get Group Chat Rooms", chatRooms));
    }

    // 그룹채팅방참여
    @PostMapping("/room/group/{roomId}/join")
    public ResponseEntity<CommonResponseDto<Object>> joinGroupChatRoom(@PathVariable Long roomId, HttpServletRequest request){
        chatService.addParticipantToGroupChat(roomId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Join Group Chat Room", null));
    }

    // 이전 메시지 조회
    @GetMapping("/history/{roomId}")
    public ResponseEntity<CommonResponseDto<List<ChatMessageReqDto>>> getChatHistory(@PathVariable Long roomId, HttpServletRequest request){
        List<ChatMessageReqDto> chatMessageDtos = chatService.getChatHistory(roomId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Get Chat History", chatMessageDtos));
    }

    // 채팅메시지 읽음처리
    @RequestMapping(value = "/room/{roomId}/read", method = RequestMethod.PATCH)
    public ResponseEntity<CommonResponseDto<Object>> messageRead(@PathVariable Long roomId, HttpServletRequest request) {
        chatService.messageRead(roomId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Message Read", null));
    }

    //    내채팅방목록조회 : roomId, roomName, 그룹채팅여부, 메시지읽음개수
    @GetMapping("/my/rooms")
    public ResponseEntity<CommonResponseDto<List<MyChatListResDto>>> getMyChatRooms(HttpServletRequest request){
        List<MyChatListResDto> myChatListResDtos = chatService.getMyChatRooms(request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Get My Chat Rooms", myChatListResDtos));
    }

    // 단체 채팅방 나가기
    @DeleteMapping("/room/group/{roomId}/leave")
    public ResponseEntity<CommonResponseDto<Object>> leaveGroupChatRoom(@PathVariable Long roomId, HttpServletRequest request){
        chatService.leaveGroupChatRoom(roomId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Leave Group Chat Room", null));
    }

    // 개인 채팅방 나가기
    @DeleteMapping("/room/private/{roomId}/leave")
    public ResponseEntity<CommonResponseDto<Object>> leavePrivateChatRoom(@PathVariable Long roomId, HttpServletRequest request){
        chatService.leavePrivateChatRoom(roomId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Leave Private Chat Room", null));
    }

    // 개인 채팅방 개설 또는 기존roomId return
    @PostMapping("/room/private/create")
    public ResponseEntity<CommonResponseDto<Long>> getOrCreatePrivateRoom(@RequestParam Long otherUserId, HttpServletRequest request){
        Long roomId = chatService.getOrCreatePrivateRoom(otherUserId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Get or Create Private Room", roomId));
    }

    @GetMapping("/room/{roomId}/participants")
    public ResponseEntity<CommonResponseDto<List<ChatRoomParticipantsReqDto>>> getChatRoomUsers(@PathVariable Long roomId){
        List<ChatRoomParticipantsReqDto> dtos = chatService.getRoomUsers(roomId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "✅ Get Chat Room Users", dtos));
    }
}
