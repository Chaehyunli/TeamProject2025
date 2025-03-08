import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyChatRooms, leaveChatRoom } from "../api/chatApi";

const MyChatPage = () => {
    const [chatList, setChatList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadMyChatRooms();
    }, []);

    // ✅ 내 채팅방 목록 불러오기
    const loadMyChatRooms = async () => {
        try {
            const chatRooms = await fetchMyChatRooms();
            setChatList(chatRooms);
            console.log(chatRooms);
        } catch (error) {
            console.error("❌ 내 채팅방 목록 불러오기 실패", error);
        }
    };

    // ✅ 채팅방 입장
    const enterChatRoom = (roomId, receiverName) => {
        navigate(`/chatpage/${roomId}`, { state: { receiverName } });
    };

    // ✅ 채팅방 나가기
    const handleLeaveChatRoom = async (roomId) => {
        try {
            await leaveChatRoom(roomId);
            setChatList(chatList.filter((chat) => chat.roomId !== roomId)); // 채팅방 목록 업데이트
        } catch (error) {
            console.error("❌ 채팅방 나가기 실패", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-center text-2xl font-bold">내 채팅 목록</h1>
            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">채팅방 이름</th>
                    <th className="border p-2">읽지 않은 메시지</th>
                    <th className="border p-2">액션</th>
                </tr>
                </thead>
                <tbody>
                {chatList.map((chat) => (
                    <tr key={chat.roomId} className="border">
                        <td className="border p-2">{chat.roomName}</td>
                        <td className="border p-2">{chat.unReadCount}</td>
                        <td className="border p-2">
                            <button
                                onClick={() => enterChatRoom(chat.roomId, chat.roomName)}
                                className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                            >
                                입장
                            </button>
                            <button
                                onClick={() => handleLeaveChatRoom(chat.roomId)}
                                className="bg-red-500 text-white px-4 py-1 rounded"
                            >
                                나가기
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyChatPage;
