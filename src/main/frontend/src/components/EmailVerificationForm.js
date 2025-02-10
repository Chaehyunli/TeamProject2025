// import React, { useState } from "react";
// import axios from "axios";
//
// const EmailVerificationForm = () => {
//     const [email, setEmail] = useState("");
//     const [verificationCode, setVerificationCode] = useState("");
//     const [isCodeSent, setIsCodeSent] = useState(false);
//     const [message, setMessage] = useState("");
//
//     // 이메일 인증 요청 (Spring Boot API 호출)
//     const requestVerificationCode = async () => {
//         try {
//             const response = await axios.post("http://localhost:8080/api/v1/auth/email", { email });
//             setIsCodeSent(true);
//             setMessage("인증 코드가 이메일로 전송되었습니다. 확인 후 입력하세요.");
//         } catch (error) {
//             setMessage("이메일 전송 중 오류가 발생했습니다.");
//             console.error(error);
//         }
//     };
//
//     // 인증 코드 검증 요청
//     const verifyCode = async () => {
//         try {
//             const response = await axios.post(
//                 "http://localhost:8080/api/v1/auth/email/verify",
//                 {
//                     email,
//                     verificationCode,
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             setMessage("이메일 인증이 완료되었습니다.");
//         } catch (error) {
//             setMessage("인증 코드가 올바르지 않거나 만료되었습니다.");
//             console.error(error);
//         }
//     };
//
//     return (
//         <div style={containerStyle}>
//             <h2>이메일 인증</h2>
//             <input
//                 type="email"
//                 placeholder="이메일 입력"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={inputStyle}
//             />
//             {!isCodeSent ? (
//                 <button onClick={requestVerificationCode} style={buttonStyle}>
//                     인증 코드 받기
//                 </button>
//             ) : (
//                 <>
//                     <input
//                         type="text"
//                         placeholder="인증 코드 입력"
//                         value={verificationCode}
//                         onChange={(e) => setVerificationCode(e.target.value)}
//                         style={inputStyle}
//                     />
//                     <button onClick={verifyCode} style={buttonStyle}>
//                         인증 확인
//                     </button>
//                 </>
//             )}
//             {message && <p>{message}</p>}
//         </div>
//     );
// };
//
// // 스타일 정의
// const containerStyle = {
//     maxWidth: "400px",
//     margin: "auto",
//     padding: "20px",
//     textAlign: "center",
// };
//
// const inputStyle = {
//     width: "100%",
//     padding: "10px",
//     margin: "10px 0",
//     fontSize: "16px",
// };
//
// const buttonStyle = {
//     width: "100%",
//     padding: "10px",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     fontSize: "16px",
//     border: "none",
//     cursor: "pointer",
// };
//
// export default EmailVerificationForm;

import React, { useState, useEffect } from "react";
import axios from "axios";

const EmailVerificationForm = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [message, setMessage] = useState("");
    const [timer, setTimer] = useState(0); // 60초 타이머

    // 이메일 인증 요청 (Spring Boot API 호출)
    const requestVerificationCode = async () => {
        try {
            await axios.post("http://localhost:8080/api/v1/auth/email", { email });
            setIsCodeSent(true);
            setMessage("인증 코드가 이메일로 전송되었습니다. 확인 후 입력하세요.");
            setTimer(60); // 타이머 60초 설정
        } catch (error) {
            setMessage("이메일 전송 중 오류가 발생했습니다.");
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

            // ✅ 인증 성공 시 타이머 종료 + 메시지 변경
            setMessage("이메일 인증이 완료되었습니다.");
            setTimer(0); // 타이머 중지
            setIsCodeSent(false); // 인증 UI 초기화
        } catch (error) {
            setMessage("인증 코드가 올바르지 않거나 만료되었습니다.");
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

    return (
        <div style={containerStyle}>
            <h2>이메일 인증</h2>
            <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                disabled={isCodeSent} // ✅ 코드 발송 후 이메일 입력 비활성화
            />
            {!isCodeSent ? (
                <button onClick={requestVerificationCode} style={buttonStyle}>
                    인증 코드 받기
                </button>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="인증 코드 입력"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={verifyCode} style={buttonStyle} disabled={timer === 0}>
                        인증 확인
                    </button>
                    {timer > 0 && <p style={timerStyle}>남은 시간: {timer}초</p>}
                </>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

// 스타일 정의
const containerStyle = {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
};

const timerStyle = {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
};

export default EmailVerificationForm;
