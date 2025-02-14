import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import LoginForm from "../components/LoginForm";

function LoginPage() {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    useEffect(() => {
        // 로그인 상태 확인 후 자동 이동
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            navigate("/home");
        }
    }, [navigate]);

    // 로그인 처리 함수 (LoginForm에서 호출)
    const handleLogin = async (formData, setMessage) => {
        try {
            const result = await login(formData);
            setMessage(result.message);

            localStorage.setItem("userId", result.userId);
            localStorage.setItem("username", result.username);
            localStorage.setItem("name", result.name);

            window.location.href = "/home";  // 로그인 성공 시 이동
        } catch (error) {
            setMessage("오류 발생: " + error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">로그인</h2>
                <LoginForm onSubmit={handleLogin}/> {/* LoginForm 사용 */}
                <div className="flex justify-between text-sm mt-3 text-gray-600">
                    <span className="hover:text-[#65A3FF] transition cursor-pointer" onClick={() => navigate("/account/find")}>
                        아이디/비밀번호 찾기
                    </span>
                    <span className="hover:text-[#65A3FF] transition cursor-pointer" onClick={() => navigate("/register")}>
                        회원가입
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
