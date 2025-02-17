import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerificationForm from "./EmailVerificationForm";
import InputField from "./InputField";
import { register } from "../api/userApi";

const RegisterForm = ({ onSubmit }) => {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        universityName: "",
        studentId: "",
        isEmailVerified: false,
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 이메일 인증 성공 시 상태 업데이트
    const handleEmailVerificationSuccess = (response) => {
        setFormData((prevData) => ({
            ...prevData,
            email: response.email,
            isEmailVerified: response.isEmailVerified,
        }));
        console.log("이메일 인증 완료:", response);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 이메일 인증 확인
        if (!formData.email || !formData.isEmailVerified) {
            setMessage("이메일 인증을 완료해주세요.");
            return;
        }

        console.log("서버에 보낼 데이터:", formData); // 데이터 확인

        try {
            await register(formData); // API 호출
            alert("회원가입 완료!"); // 알림창 표시
            navigate("/login"); // 로그인 페이지로 이동
        } catch (error) {
            setMessage("오류 발생: " + error.message);
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

            {/* 이름 입력 */}
            <InputField
                label="이름"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            {/* 학번 입력 */}
            <InputField
                label="학번"
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                minLength="8"
                maxLength="8"
                pattern="\d{8}"
                placeholder="학번 (예: 12345678)"
            />

            {/* 학교 입력 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">학교</label>
                <select
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                >
                    <option value="">학교를 선택하세요</option>
                    <option value="서울대학교">서울대학교</option>
                    <option value="연세대학교">연세대학교</option>
                    <option value="고려대학교">고려대학교</option>
                    <option value="한양대학교">한양대학교</option>
                    <option value="성균관대학교">성균관대학교</option>
                    <option value="명지대학교">명지대학교</option>
                </select>
            </div>

            {/* 이메일 인증 폼 */}
            <EmailVerificationForm onVerificationSuccess={handleEmailVerificationSuccess} />

            {/* 회원가입 버튼 */}
            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-hoverBlueColor transition duration-300"
            >
                회원가입
            </button>

            {/* 오류 메시지 출력 */}
            {message && <p className="text-warningText text-center mt-3 text-sm">{message}</p>}
        </form>
    );
};

export default RegisterForm;
