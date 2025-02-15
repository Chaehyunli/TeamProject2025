import React, { useState, useEffect } from "react";
import { requestVerificationCode, verifyCode } from "../api/authApi";
import InputField from "./InputField";

const EmailVerificationForm = ({ onVerificationSuccess, initialEmail, onEmailChange}) => {
    const [email, setEmail] = useState(initialEmail || ""); // 초기값 설정
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [message, setMessage] = useState("");
    const [timer, setTimer] = useState(300); // 5분 (300초)

    // `initialEmail` 값이 변경되면 자동으로 `email` 상태에 반영
    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]); // `initialEmail`이 변경될 때마다 업데이트

    // 이메일 입력값 변경 시 부모 컴포넌트에 전달
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        onEmailChange(newEmail); // 부모 컴포넌트(`UpdateProfilePage`)로 업데이트 반영
    };

    // 이메일 인증 요청
    const handleRequestVerificationCode = async () => {
        try {
            await requestVerificationCode(email);
            setIsCodeSent(true);
            setMessage("✅ 인증 코드가 이메일로 전송되었습니다.");
            setTimer(300);
        } catch (error) {
            setMessage("⚠️ 이메일 전송 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    // 인증 코드 검증 요청
    const handleVerifyCode = async () => {
        try {
            await verifyCode(email, String(verificationCode));
            setMessage("✅ 이메일 인증이 완료되었습니다.");
            setTimer(0);
            setIsCodeSent(false);
            onVerificationSuccess({ email: email, isEmailVerified: true });
        } catch (error) {
            setMessage("❌ 인증 코드가 올바르지 않거나 만료되었습니다.");
            console.error(error);
        }
    };

    // 타이머 감소 로직
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // 초 → MM:SS 변환 함수
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    return (
        <div className="max-w-md w-full mx-auto my-4">
            <div className="flex items-center justify-between">
                <InputField
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={handleEmailChange}    
                    disabled={isCodeSent}
                />
                <button
                    type="button"
                    onClick={handleRequestVerificationCode}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-200 transition"
                >
                    인증번호 발송
                </button>
            </div>

            {isCodeSent && (
                <>
                    <div className="flex items-center justify-between my-4">
                        <InputField
                            type="text"
                            placeholder="인증번호"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <span
                            className="text-sm font-bold text-gray-600 min-w-[50px] text-right">{formatTime(timer)}</span>
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-200 transition"
                            disabled={timer === 0}
                        >
                            인증
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">*인증번호는 5분 이내에 입력해야 하며, 시간이 초과되면 다시 요청해야 합니다.</p>
                </>
            )}

            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        </div>
    );
};

export default EmailVerificationForm;
