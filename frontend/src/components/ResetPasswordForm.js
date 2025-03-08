import React, {useEffect, useRef, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "./InputField";
import { resetPassword } from "../api/authApi";

const ResetPasswordForm = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const location = useLocation();
    const [message, setMessage] = useState("");
    const isRedirected = useRef(false);

    // 이전 페이지에서 전달받은 formData (username, email, isEmailVerified)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        isEmailVerified: "",
        newPassword: "",
        confirmPassword: ""
    });


    let cnt = 0;
    useEffect(() => {
        // 이전 페이지('/account/find/pw')에서 데이터가 전달되지 않았거나 이메일 인증이 안 된 경우 접근 차단
        if (!location.state || (location.state && !location.state.isEmailVerified)) {
            if (!isRedirected.current) {
                alert("잘못된 접근입니다. 이메일 인증을 먼저 완료해주세요.");
                isRedirected.current = true;
            }
            window.location.href = "/login"; // 로그인 페이지로 이동
        }

        if (location.state) {
            setFormData((prevData) => ({
                ...prevData, // 이전 데이터 유지
                username: location.state.username,
                email: location.state.email,
                isEmailVerified: location.state.isEmailVerified,
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({
            ...formData, // 기존 formData 는 유지
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 이메일 인증 확인
        if (!formData.email || !formData.isEmailVerified) {
            setMessage("이메일 인증을 완료해주세요.");
            return ;
        }

        // 비밀번호 매칭 확인
        if(formData.newPassword !== formData.confirmPassword){
            setMessage("비밀번호 서로 일치하지 않습니다.");
            return ;
        }

        console.log("서버에 보낼 데이터: ", formData); // 데이터 확인

        try{
            const result = await resetPassword(formData); // API 호출
            setMessage(result.message);

            alert("비밀번호를 변경했습니다."); // PW 변경 성공 알림

            window.location.href = "/login"; // 로그인 페이지로 이동
        } catch (error) {
            setMessage("비밀번호 재설정 실패 : " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-extraText">※ 영문, 숫자, 특문이 2종류 이상 조합된 8~20자</p>

            {/* 새로운 비밀번호 입력 */}
            <InputField
                label="새로운 비밀번호"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
            />

            {/* 비밀번호 확인 */}
            <InputField
                label="비밀번호 확인"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />

            {/* 비밀번호 변경 버튼 */}
            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md font-medium hover:text-hoverBlueColor transition duration-300"
            >
                비밀번호 변경
            </button>

            {/* 오류 메시지 출력 */}
            {message && <p className="text-warningText text-center mt-3 text-sm">{message}</p>}
        </form>
    );
};

export default ResetPasswordForm;
