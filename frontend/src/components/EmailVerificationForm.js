import React, { useState, useEffect } from "react";
import { requestVerificationCode, verifyCode } from "../api/authApi";
import InputField from "./InputField";
import {getUniversityNameByEmail} from "../api/authApi";

const EmailVerificationForm = ({
    onVerificationSuccess,
    initialEmail,
    onEmailChange,
    universityName,
}) => {
    const [email, setEmail] = useState(initialEmail || ""); // 초기값 설정
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [message, setMessage] = useState("");
    const [timer, setTimer] = useState(300);
    const [intervalId, setIntervalId] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [canResend, setCanResend] = useState(true); // 10초 제한 상태
    const [resendCountdown, setResendCountdown] = useState(10);

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
        if (onEmailChange) {
            onEmailChange(newEmail);
        }
    };

    // 이메일 인증 요청
    const handleRequestVerificationCode = async () => {
        if (!canResend) return; // 10초 제한 중일 때 막기

        setCanResend(false);
        setResendCountdown(10);

        const countdownInterval = setInterval(() => {
            setResendCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setIsCodeSent(true);  // 즉시 UI 변경 (인증번호 입력칸 바로 표시)
        setMessage("✅ 인증 코드가 이메일로 전송 중입니다...");

        if (intervalId) clearInterval(intervalId);
        setTimer(300);
        const newIntervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        setIntervalId(newIntervalId);

        try {
            // universityName이 없는 경우 API를 통해 가져오기
            if (!universityName) {
                universityName = await getUniversityNameByEmail(email);
            }
            await requestVerificationCode(email, universityName);
            setMessage("✅ 인증 코드가 이메일로 전송되었습니다.");
        } catch (error) {
            if (
                error.response && (
                    error.response.data.message === "대학교 이메일을 입력해주세요" ||
                    error.response.data.message === "대학교 이름 조회 중 오류 발생: 도메인에 해당하는 대학교를 찾을 수 없습니다."
                )
            ) {
                setMessage("❌ 대학교 이메일을 입력해주세요.");
            } else {
                setMessage("⚠️ 이메일 전송 중 오류가 발생했습니다.");
            }
            console.error(error);
            setIsCodeSent(false);
        }
    };

    // isCodeSent 상태 변화를 감지하여 메시지 업데이트
    useEffect(() => {
        if (isCodeSent) {
            setMessage("✅ 인증 코드가 이메일로 전송되었습니다.");
        }
    }, [isCodeSent]);


    // 인증 코드 검증 요청
    const handleVerifyCode = async () => {
        if (isVerifying) return;

        setIsVerifying(true);
        try {
            await verifyCode(email, String(verificationCode));
            setMessage("✅ 이메일 인증이 완료되었습니다.");
            setTimer(0);
            setIsCodeSent(false);
            clearInterval(intervalId);
            onVerificationSuccess({ email: email, isEmailVerified: true });
        } catch (error) {
            setMessage("❌ 인증 코드가 올바르지 않거나 만료되었습니다.");
            console.error(error);
        } finally {
            setIsVerifying(false);
        }
    };

    // 타이머 감소 로직
    useEffect(() => {
        if (timer <= 0 && intervalId) {
            clearInterval(intervalId);
        }
    }, [timer, intervalId]);

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
                    className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-hoverWhiteColor transition"
                    disabled={!canResend}
                    title={!canResend ? `${resendCountdown}초 뒤 재요청 가능` : ""}
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
                        <span className="text-sm font-bold text-extraText min-w-[50px] text-right">
                            {formatTime(timer)}
                        </span>
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-hoverWhiteColor transition"
                            disabled={timer === 0 || isVerifying}
                        >
                            인증
                        </button>
                    </div>
                    <p className="text-xs text-extraText">
                        *인증번호는 5분 이내에 입력해야 하며, 시간이 초과되면 다시 요청해야 합니다.
                    </p>
                </>
            )}

            {message && <p className="mt-3 text-sm text-extraText">{message}</p>}
        </div>
    );
};

export default EmailVerificationForm;