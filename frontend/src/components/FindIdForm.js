import React, { useState } from "react";
import EmailVerificationForm from "./EmailVerificationForm";
import {findUsername} from "../api/authApi";

const FindIdForm = () => {
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        isEmailVerified: false,
    });

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
        try {
            // 이메일 인증 확인
            if (!formData.isEmailVerified) {
                alert("이메일 인증을 완료해주세요.");
                return;
            }

            const foundUsername = await findUsername(formData);

            alert("귀하의 아이디는 "+foundUsername+" 입니다.");
            window.location.href = "/login";

        } catch (error){
            setMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* 이메일 인증 폼 */}
            <EmailVerificationForm onVerificationSuccess={handleEmailVerificationSuccess}/>

            {/* 아이디 찾기 버튼 */}
            <button
                type="submit"
                className="w-full bg-[#65A3FF] text-white py-2 rounded-md font-medium hover:bg-blue-500 transition duration-300"
            >
                아이디 찾기
            </button>

            {/* 오류 메시지 출력 */}
            {message && <p className="text-red-500 text-center mt-3 text-sm">{message}</p>}
        </form>
    );
};

export default FindIdForm;
