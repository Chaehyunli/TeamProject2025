import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/userApi";
import { logout } from "../api/authApi";

const HeaderComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("https://via.placeholder.com/50");
    const navigate = useNavigate();

    // 로그인된 사용자 정보 가져오기
    const fetchProfile = async () => {
        try {
            const response = await getUserProfile();
            if (response.data) {
                setIsLoggedIn(true);
                setUsername(response.data.data.name || "사용자");
                setUserImage(response.data.data.profileImage || "https://via.placeholder.com/50");
            }
        } catch (error) {
            console.error("❌ 사용자 정보를 불러오지 못했습니다:", error);
            setIsLoggedIn(false);
        }
    };

    // 로그인 상태 확인
    useEffect(() => {
        fetchProfile();
    }, []);

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            setUsername("");
            setUserImage("");
            navigate("/login"); // ✅ 로그아웃 후 로그인 페이지로 이동
        } catch (error) {
            console.error("❌ 로그아웃 실패", error);
        }
    };

    return (
        <div className="bg-gray-800 text-white p-4 flex justify-between">
            <div className="flex gap-4">
                <Link to="/user/list" className="text-white hover:underline">회원목록</Link>
                <Link to="/groupchatting/list" className="text-white hover:underline">채팅방목록</Link>
            </div>
            <div className="text-center">
                <Link to="/" className="text-white text-lg font-bold">chat 서비스</Link>
            </div>
            <div className="flex gap-4">
                {isLoggedIn ? (
                    <>
                        <Link to="/my/chat/page" className="text-white hover:underline">MyChatPage</Link>
                        <button onClick={handleLogout} className="text-white hover:underline">로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/user/create" className="text-white hover:underline">회원가입</Link>
                        <Link to="/login" className="text-white hover:underline">로그인</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default HeaderComponent;
