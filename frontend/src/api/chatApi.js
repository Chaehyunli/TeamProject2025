import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

const API_BASE_URL = "http://localhost:8080/api/v1/chat";
const API_LOCAL_BASE_URL = "http://localhost:8080";

// 채팅방 참여자 목록 가져오기
export const fetchChatParticipants = async (roomId) => {
    console.log("Fetching participants for room:", roomId);

    try {
        const response = await axios.get(`${API_BASE_URL}/room/${roomId}/participants`, {
            withCredentials: true // ✅ 세션 방식 적용
        });

        console.log("✅ API Response:", response.data);

        const mappedData = {};
        response.data.data.forEach(user => {
            console.log("Mapping user:", user); // 전체 객체 출력
            console.log(`Email 확인: ${user.email}`); // email 값 확인

            if (!user.email) {
                console.error("❌ user.email이 undefined입니다. API 응답을 확인하세요:", user);
                return;
            }

            mappedData[user.email] = {
                name: user.name,
                profileImage: user.profileImage,
                email: user.email
            };
        });

        return mappedData;

    } catch (error) {
        console.error("❌ 채팅 참여자 목록 불러오기 실패:", error);
        throw error;
    }
};

// 채팅 내역 가져오기
export const fetchChatHistory = async (roomId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history/${roomId}`, {
            withCredentials: true // ✅ 세션 방식으로 변경
        });
        return response.data.data;
    } catch (error) {
        console.error("❌ 채팅 내역을 불러오는 중 오류 발생:", error);
        throw error;
    }
};

// 채팅 읽음 처리
export const markMessagesAsRead = async (roomId) => {
    try {
        await axios.patch(`${API_BASE_URL}/room/${roomId}/read`, {}, {
            withCredentials: true // ✅ 세션 방식으로 변경
        });
        console.log("✅ 채팅 메시지 읽음 처리 완료");
    } catch (error) {
        console.error("❌ 채팅 메시지 읽음 처리 중 오류 발생:", error);
    }
};

// 1:1 채팅방 생성 (또는 기존 채팅방 ID 반환)
export const createPrivateChatRoom = async (otherUserId, clubId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/room/private/create?otherUserId=${otherUserId}&clubId=${clubId}`,
            {},
            { withCredentials: true } // ✅ 세션 방식으로 변경
        );
        return response.data.data;
    } catch (error) {
        console.error("❌ 1:1 채팅방 생성 중 오류 발생:", error);
        throw error;
    }
};

// 채팅방 나가기
export const leaveChatRoom = async (roomId) => {
    try {
        await axios.delete(`${API_BASE_URL}/room/private/${roomId}/leave`, {
            withCredentials: true // ✅ 세션 방식 적용
        });
        console.log(`✅ 채팅방 (${roomId}) 나가기 성공`);
    } catch (error) {
        console.error("❌ 채팅방 나가기 실패:", error);
        throw error;
    }
};

// 내 채팅방 목록 가져오기
export const fetchMyChatRooms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my/rooms`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error("❌ 내 채팅방 목록 불러오기 실패:", error);
        throw error;
    }
};

export const fetchChatRoomName = async (roomId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/room/${roomId}/name`, {
            withCredentials: true
        });
        return response.data.data; // roomName 반환
    } catch (error) {
        console.error("❌ 채팅방 이름 불러오기 실패:", error);
        throw error;
    }
};

export const fetchPresignedUrl = async (objectName) => {
    try {
        const response = await axios.get(`${API_LOCAL_BASE_URL}/api/v1/upload/presigned-url/download`, {
            params: { objectName },
            withCredentials: true
        });
        return response.data.data.url;
    } catch (error) {
        console.error("❌ Presigned URL 요청 실패:", error);
        throw error;
    }
};

export const fetchReceiverProfileImageUrl = async (receiverEmail, participants) => {
    if (!receiverEmail || !participants[receiverEmail]) return null;

    const userProfile = participants[receiverEmail];

    try {
        if (userProfile.profileImage && !userProfile.profileImage.startsWith("http")) {
            // Presigned URL이 필요한 경우
            const presignedUrl = await fetchPresignedUrl(userProfile.profileImage);
            return presignedUrl;
        } else {
            // URL이 이미 존재하는 경우 (http 또는 https로 시작하는 경우)
            return userProfile.profileImage;
        }
    } catch (error) {
        console.error("❌ 프로필 이미지 가져오기 실패:", error);
        return null;
    }
};

let stompClient = null;
let subscription = null;
let isConnected = false;

export const connectWebSocket = (roomId, onMessageReceived) => {
    if (isConnected) return;

    console.log("🔗 Connecting WebSocket...");

    const sockJs = new SockJS(`${API_LOCAL_BASE_URL}/connect`);
    stompClient = Stomp.over(sockJs);

    stompClient.connect({}, (frame) => {
            console.log("✅ STOMP WebSocket 연결 성공", frame.headers);
            isConnected = true;

            if (subscription) {
                subscription.unsubscribe();
                subscription = null;
            }

            subscription = stompClient.subscribe(
                `/topic/${roomId}`,
                (message) => {
                    console.log("📩 메시지 수신:", message.body);
                    const receivedMessage = JSON.parse(message.body);
                    onMessageReceived(receivedMessage);
                }
            );
        },
        (error) => {
            console.error("❌ WebSocket 연결 실패", error);
            isConnected = false;
        }
    );
};

export const sendMessage = (roomId, senderEmail, message) => {
    if (!isConnected || message.trim() === "") return;

    const messageData = { senderEmail, message };

    stompClient.send(
        `/publish/${roomId}`,
        JSON.stringify(messageData),
        { "content-length": new TextEncoder().encode(JSON.stringify(messageData)).length }
    );
};

export const disconnectWebSocket = async (roomId) => {
    if (!stompClient || !isConnected) return;

    console.log("🔌 Disconnecting WebSocket .. 여긴 method 내부 코드임. ㄹㅇ");

    try {
        subscription?.unsubscribe();
        subscription = null;

        await new Promise(resolve => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("✅ WebSocket 해제 완료.");
                    isConnected = false;
                    stompClient = null;
                    resolve();
                });
            } else {
                console.log("⚠️ WebSocket 연결이 이미 끊어져 있음.");
                resolve();
            }
        });

        // ✅ 읽음 처리 API 요청 추가
        await markMessagesAsRead(roomId);

    } catch (error) {
        console.error("❌ WebSocket 해제 중 오류 발생", error);
    }
};

export const loadChatHistory = async (roomId, senderEmail, setMessages, setReceiverEmail, setRoomName) => {
    try {
        const chatHistory = await fetchChatHistory(roomId);
        console.log("📜 채팅 내역:", chatHistory);
        setMessages(chatHistory);

        const foundReceiverEmail = chatHistory.find(msg => msg.senderEmail !== senderEmail)?.senderEmail || "unknown";
        setReceiverEmail(foundReceiverEmail);

        const roomNameResponse = await fetchChatRoomName(roomId);
        setRoomName(roomNameResponse || "알 수 없음");
    } catch (error) {
        console.error("❌ Failed to load chat history", error);
    }
};