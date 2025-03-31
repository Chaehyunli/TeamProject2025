import React, { useState } from "react";
import { createPrivateChatRoom } from "../api/chatApi";
import { useNavigate } from "react-router-dom";

const DirectMessageButton = ({ presidentId, receiverName, clubId}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId");

    const handleStartChat = async () => {
        if (!presidentId) {
            setError("회장 정보를 불러올 수 없습니다.");
            return;
        }

        if (String(presidentId) === String(currentUserId)) {
            setError("자신과의 채팅은 불가능 합니다.");
            console.log("Error: Trying to chat with self");
            return;
        }

        console.log("President ID: " + presidentId);
        console.log("Club ID: " + clubId);

        setLoading(true);
        setError(null);

        try {
            // 1:1 채팅방 개설 요청 (or 기존 방 ID 반환)
            const roomId = await createPrivateChatRoom(presidentId, clubId);

            // 채팅방으로 이동
            // window.location.href = `/chatpage/${roomId}`;
            navigate(`/chatpage/${roomId}`, { state: { receiverName } }); // goto Stomp Page
        } catch (err) {
            setError("채팅방을 개설하는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <button
                onClick={handleStartChat}
                className="bg-primary hover:bg-hoverBlueColor text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "채팅방 생성 중..." : "회장에게 1:1 문의하기"}
            </button>
            {error && <p className="text-warningText mt-2">{error}</p>}
        </div>
    );
};

export default DirectMessageButton;