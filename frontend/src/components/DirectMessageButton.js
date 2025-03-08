import { useState } from "react";
import { createPrivateChatRoom } from "../api/chatApi";
import { useNavigate } from "react-router-dom";

const DirectMessageButton = ({ presidentId, presidentName}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleStartChat = async () => {
        if (!presidentId) {
            setError("회장 정보를 불러올 수 없습니다.");
            return;
        }

        console.log("President ID: " + presidentId);

        setLoading(true);
        setError(null);

        try {
            // 1:1 채팅방 개설 요청 (or 기존 방 ID 반환)
            const roomId = await createPrivateChatRoom(presidentId);

            // 채팅방으로 이동
            // window.location.href = `/chatpage/${roomId}`;
            navigate(`/chatpage/${roomId}`, { state: { presidentName } });
        } catch (err) {
            setError("채팅방을 개설하는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <button
                onClick={handleStartChat}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "채팅방 생성 중..." : "회장에게 1:1 문의하기"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default DirectMessageButton;