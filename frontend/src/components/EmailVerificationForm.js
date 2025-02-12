import React, { useState, useEffect } from "react";
import { requestVerificationCode, verifyCode } from "../api/authApi";

const EmailVerificationForm = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [message, setMessage] = useState("");
    const [timer, setTimer] = useState(300); // 5분 (300초)

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
            const response = await verifyCode(email, verificationCode);
            setMessage("✅ 이메일 인증이 완료되었습니다.");
            setTimer(0);
            setIsCodeSent(false);

            onVerificationSuccess(response); // 부모 컴포넌트로 성공 전달
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
        <div className="max-w-md mx-auto mt-12 p-6 text-center border border-gray-300 rounded-lg shadow-lg bg-white">
            <div className="flex items-center gap-2 mb-3">
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 text-lg border border-gray-300 rounded-full bg-gray-100 focus:outline-none"
                    disabled={isCodeSent}
                />
                <button onClick={handleRequestVerificationCode} className="px-4 py-2 text-lg border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                    인증번호 발송
                </button>
            </div>

            {isCodeSent && (
                <>
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="인증번호"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="flex-1 px-4 py-2 text-lg border border-gray-300 rounded-full bg-gray-100 focus:outline-none"
                        />
                        <button onClick={handleVerifyCode} className="px-4 py-2 text-lg border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 transition" disabled={timer === 0}>
                            인증
                        </button>
                        <span className="text-sm font-bold text-gray-600 min-w-[50px] text-right">{formatTime(timer)}</span>
                    </div>
                    <p className="text-xs text-gray-500">*인증번호는 5분 이내에 입력해야 하며, 시간이 초과되면 다시 요청해야 합니다.</p>
                </>
            )}

            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        </div>
    );
};

export default EmailVerificationForm;
