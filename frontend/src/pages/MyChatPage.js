import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyChatRooms, leaveChatRoom } from "../api/chatApi";
import backIcon from "../assets/backIcon.png";

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

            const sortedChatRooms = chatRooms.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );

            setChatList(sortedChatRooms);
            console.log(sortedChatRooms);
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

    function formatTimeFromISO(isoString) {
        return new Date(isoString).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    }

    return (
        <div className="flex flex-col items-center justify-center py-40">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
                <div
                    className="p-4 border-blue-500 border-b border-b-white flex relative justify-center items-center bg-blue-900 text-white font-semibold text-lg rounded-t-2xl">
                    <button onClick={() => window.history.back()} className="absolute left-4">
                        <img src={String(backIcon)} alt="뒤로가기" className="w-5 h-5"/>
                    </button>
                    My Chatting Room
                </div>

                <div className="h-[600px] overflow-y-auto p-4 space-y-3">
                    {chatList.length === 0 ? (
                        <div className="grid place-items-center h-[500px]">
                            <span className="font-bold text-gray-500 text-3xl">Empty Room</span>
                        </div>
                    ) : (
                        chatList.map((chat) => (
                            <div key={chat.roomId}
                                 className="flex items-center justify-between bg-white rounded-lg border p-3 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-md font-semibold">{chat.roomName}</span>
                                    <span className="text-sm text-gray-500">{formatTimeFromISO(chat.updatedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span
                                        className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{chat.unReadCount}</span>
                                    <button
                                        onClick={() => enterChatRoom(chat.roomId, chat.roomName)}
                                        className="bg-blue-500 text-white px-4 py-1 rounded"
                                    >
                                        입장
                                    </button>
                                    <button
                                        onClick={() => handleLeaveChatRoom(chat.roomId)}
                                        className="bg-red-500 text-white px-4 py-1 rounded"
                                    >
                                        나가기
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

};

export default MyChatPage;
