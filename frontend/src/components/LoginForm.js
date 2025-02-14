import React, { useState } from "react";

const LoginForm = ({ onSubmit }) => {
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
            await onSubmit(formData, setMessage); // 부모 컴포넌트(LoginPage.js)에서 처리
        } catch (error) {
            setMessage("오류 발생: " + error.message);
        }
    };

    return (
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

            {/* 오류 메시지 출력 */}
            {message && <p className="text-red-500 text-center mt-3 text-sm">{message}</p>}
        </form>
    );
};

export default LoginForm;
