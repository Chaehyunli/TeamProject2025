import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerificationForm from "./EmailVerificationForm";
import {verifyUsername} from "../api/authApi";

const UpdatePasswordForm = ({ universityName , username}) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        isEmailVerified: false,
    });

    // ✅ username이 props로 들어오면 formData에 반영
    useEffect(() => {
        if (username) {
            setFormData((prev) => ({
                ...prev,
                username: username,
            }));
        }
    }, [username]);

    console.log(`😝 대학교 이름 잘 들어왔나? => ${universityName}`);
    console.log(`😝 아이디도 잘 들어왔나? => ${username}`);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 이메일 인증 성공 시 상태 업데이트
    const handleEmailVerificationSuccess = (response) => {
        if (!universityName) {
            setMessage("❌ 대학교 정보가 누락되었습니다.");
            return;
        }

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

            await verifyUsername(formData);

            // 비밀번호 변경 페이지로 이동 (데이터 유지)
            navigate("/account/reset-pw", { state: formData });
        } catch (error){
            setMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
            {/* 이메일 인증 폼 */}
            <EmailVerificationForm
                universityName={universityName}
                onVerificationSuccess={handleEmailVerificationSuccess}
            />

            {/* 비밀번호 변경 버튼 */}
            <button
                type="submit"
                className="w-full bg-[#65A3FF] text-white py-2 rounded-md font-medium hover:bg-blue-500 transition duration-300"
            >
                비밀번호 변경
            </button>

            {/* 오류 메시지 출력 */}
            {message && <p className="text-red-500 text-center mt-3 text-sm">{message}</p>}
        </form>
    );
};

export default UpdatePasswordForm;
