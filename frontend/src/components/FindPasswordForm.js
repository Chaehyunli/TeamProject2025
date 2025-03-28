import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerificationForm from "./EmailVerificationForm";
import InputField from "./InputField";
import {verifyUsername} from "../api/authApi";

const FindPasswordForm = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        isEmailVerified: false,
    });

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
        if (actionLoading) return;

        e.preventDefault();

        setActionLoading(true);
        try {
            // 이메일 인증 확인
            if (!formData.isEmailVerified) {
                alert("이메일 인증을 완료해주세요.");
                return;
            }

            await verifyUsername(formData);

            // 비밀번호 변경 페이지로 이동 (데이터 유지)
            navigate("/account/reset-pw", { state: formData });
        } catch (error){
            setMessage(error.message);
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

            {/* 이메일 인증 폼 */}
            <EmailVerificationForm onVerificationSuccess={handleEmailVerificationSuccess}/>

            {/* 비밀번호 찾기 버튼 */}
            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-hoverBlueColor transition duration-300"
            >
                비밀번호 찾기
            </button>

            {/* 오류 메시지 출력 */}
            {message && <p className="text-warningText text-center mt-3 text-sm">{message}</p>}
        </form>
    );
};

export default FindPasswordForm;
