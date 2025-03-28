import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { getUserProfile } from "../api/userApi";
import InputField from "./InputField";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const { loginUser } = useAuth();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const [actionLoading, setActionLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        if (actionLoading) return;

        e.preventDefault();

        setActionLoading(true);
        try {
            const result = await login(formData);
            setMessage(result.message);

            // 사용자 정보 즉시 가져오기 (세션 반영 확인)
            const userProfile = await getUserProfile();

            loginUser({
                userId: result.data.userId,
                username: result.data.username,
                name: result.data.name,
                profileImage: userProfile.profileImage,
            });

            window.dispatchEvent(new Event("storage"));

            // 로그인 성공 후 자동으로 홈 페이지로 이동
            navigate("/home");
        } catch (error) {
            setMessage("오류 발생: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* 아이디 입력 */}
            <InputField
                label="아이디"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />

            {/* 비밀번호 입력 */}
            <InputField
                label="비밀번호"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            {/* 로그인 버튼 */}
            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-hoverBlueColor transition duration-300"
                disabled={actionLoading}
            >
                로그인
            </button>

            {/* 오류 메시지 출력 */}
            {message && <p className="text-warningText text-center mt-3 text-sm">{message}</p>}
        </form>
    );
};

export default LoginForm;