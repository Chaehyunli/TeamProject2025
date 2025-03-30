import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/chat";

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