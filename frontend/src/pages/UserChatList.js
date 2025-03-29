import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserList } from "../api/userApi";
import { createPrivateChatRoom } from "../api/chatApi";

const UserChatList = () => {
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        loadUsers();
    }, []);

    // ✅ 회원 목록 불러오기
    const loadUsers = async () => {
        try {
            const users = await fetchUserList();
            const filteredUsers = users.filter(user => String(user.userId) !== currentUserId);
            setUserList(filteredUsers);
        } catch (error) {
            console.error("❌ 회원 목록 불러오기 실패", error);
        }
    };

    // ✅ 1:1 채팅방 생성 및 입장
    const startChat = async (otherUserId, receiverName) => {
        try {
            const roomId = await createPrivateChatRoom(otherUserId);
            navigate(`/chatpage/${roomId}`, { state: { receiverName } });
        } catch (error) {
            console.error("❌ 채팅방 생성 실패", error);
        }
    };

    return (
        <div className="py-20">
            <h1 className="text-2xl font-bold">테스트 채팅할 회원 목록</h1>
            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">이름</th>
                    <th className="border p-2">이메일</th>
                    <th className="border p-2">채팅</th>
                </tr>
                </thead>
                <tbody>
                {userList.map(user => (
                    <tr key={user.userId} className="border">
                        <td className="border p-2">{user.userId}</td>
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">
                            <button onClick={() => startChat(user.userId, user.name)}
                                    className="bg-primary text-white px-4 py-1 rounded">
                                채팅하기
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserChatList;
