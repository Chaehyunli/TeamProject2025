import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function LoginPage() {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(formData);
            setMessage(result.message);

            localStorage.setItem("userId", result.userId);
            localStorage.setItem("username", result.username);
            localStorage.setItem("name", result.name);

            // 로그인 성공 후 자동으로 홈 페이지로 이동
            window.location.href = "/home";
        } catch (error) {
            setMessage("오류 발생: " + error.message);
        }
    };

    useEffect(() => {
        // 로그인 상태 확인 후 자동 이동
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            {/* 로그인 컨테이너 */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">로그인</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 아이디 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">아이디</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                    >
                        로그인
                    </button>
                </form>

                {/* 오류 메시지 출력 */}
                {message && <p className="text-red-500 text-center mt-3 text-sm">{message}</p>}

                {/* 추가 링크 */}
                <div className="flex justify-between text-sm mt-3 text-gray-600">
                    <a href="#" className="hover:text-blue-500 transition">아이디/비밀번호 찾기</a>
                    <a href="#" className="hover:text-blue-500 transition">회원가입</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
