import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [username, setUsername] = useState(localStorage.getItem("name") || ""); // 초기값 설정
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const storedUsername = localStorage.getItem("name");
            if (storedUsername) {
                setUsername(storedUsername);
            } else {
                navigate("/login"); // 로그인되지 않았으면 로그인 페이지로 이동
            }
        };

        checkLoginStatus(); // 초기 실행

        // storage 이벤트 감지하여 상태 변경 (로그아웃하면 로그인 페이지로 이동)
        window.addEventListener("storage", checkLoginStatus);

        return () => {
            window.removeEventListener("storage", checkLoginStatus);
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome, {username}님!</h2>
            </div>
        </div>
    );
};

export default HomePage;




