import React, { useState, useEffect } from "react";
import axios from "axios";

const EmailVerificationForm = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [message, setMessage] = useState("");
    const [timer, setTimer] = useState(300); // 5분 (300초)

    // 이메일 인증 요청
    const requestVerificationCode = async () => {
        try {
            await axios.post("http://localhost:8080/api/v1/auth/email", { email });
            setIsCodeSent(true);
            setMessage("✅ 인증 코드가 이메일로 전송되었습니다.");
            setTimer(300);
        } catch (error) {
            setMessage("⚠️ 이메일 전송 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    // 인증 코드 검증 요청
    const verifyCode = async () => {
        try {
            await axios.post("http://localhost:8080/api/v1/auth/email/verify", {
                email,
                verificationCode,
            });

            // 인증 성공 시 UI 초기화
            setMessage("✅ 이메일 인증이 완료되었습니다.");
            setTimer(0);
            setIsCodeSent(false);
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
        <div style={containerStyle}>
            <div style={inputContainer}>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    disabled={isCodeSent}
                />
                <button onClick={requestVerificationCode} style={buttonStyle}>
                    인증번호 발송
                </button>
            </div>

            {isCodeSent && (
                <>
                    <div style={inputContainer}>
                        <input
                            type="text"
                            placeholder="인증번호"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            style={inputStyle}
                        />
                        <button onClick={verifyCode} style={buttonStyle} disabled={timer === 0}>
                            인증
                        </button>
                        <span style={timerStyle}>{formatTime(timer)}</span>
                    </div>
                    <p style={infoText}>*인증번호는 5분 이내에 입력해야 하며, 시간이 초과되면 다시 요청해야 합니다.</p>
                </>
            )}

            {message && <p style={messageStyle}>{message}</p>}
        </div>
    );
};

// 스타일 정의
const containerStyle = {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
};

const inputContainer = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
};

const inputStyle = {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    outline: "none",
};

const buttonStyle = {
    padding: "12px",
    backgroundColor: "#f9f9f9",
    // color: "white",
    fontSize: "16px",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "20px",
    transition: "0.3s",
};

const timerStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#666666",
    minWidth: "50px",
    textAlign: "right",
};

const messageStyle = {
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
};

const infoText = {
    fontSize: "12px",
    color: "#777",
};

export default EmailVerificationForm;

