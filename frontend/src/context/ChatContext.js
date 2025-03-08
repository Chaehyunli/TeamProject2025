import React, { createContext, useContext, useState } from "react";
import { fetchChatParticipants } from "../api/chatApi"; // 🔥 API 함수 가져오기

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [participants, setParticipants] = useState({}); // { userId: { name, profileUrl } }

    const loadChatParticipants = async (roomId) => {
        console.log("🔍 Fetching participants for room:", roomId);

        try {
            const mappedData = await fetchChatParticipants(roomId);
            setParticipants(mappedData);
        } catch (error) {
            console.error("❌ 채팅 참여자 목록 불러오기 실패", error);
        }
    };

    return (
        <ChatContext.Provider value={{ participants, fetchChatParticipants: loadChatParticipants }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("❌ useChat() must be used within a <ChatProvider>");
    }
    return context;
};
