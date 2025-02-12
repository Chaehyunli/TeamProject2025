import React, { useEffect, useState } from "react";

const HomePage = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("name");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            window.location.href = "/login"; // 로그인 페이지로 리디렉트
        }
    }, []);

    return ( // 추후 변경, 백 합친 후
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome, {username}님!</h2>
                <button
                    onClick={() => {
                        localStorage.removeItem("userId");
                        localStorage.removeItem("username");
                        localStorage.removeItem("name");
                        window.location.href = "/"; // 로그아웃 후 로그인 페이지로 이동
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default HomePage;