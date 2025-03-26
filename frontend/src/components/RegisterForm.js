import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerificationForm from "./EmailVerificationForm";
import InputField from "./InputField";
import UniversitySelect from "./UniversitySelect";
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
        profileImage: "default-profileImage.png"
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
            setMessage("오류 발생: " + error.response.data.message);
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

            {/* 학교 선택 (UniversitySelect 컴포넌트 사용) */}
            <UniversitySelect value={formData.universityName} onChange={handleChange} />

            {/* 이메일 인증 폼 */}
            <EmailVerificationForm
                initialEmail={formData.email}
                onEmailChange={(email) => setFormData((prev) => ({ ...prev, email }))} // 추가
                onVerificationSuccess={handleEmailVerificationSuccess}
                universityName={formData.universityName} // ✅ 이 줄만 추가
            />


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
