import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/auth";

// 이메일 인증 요청
export const requestVerificationCode = async (email) => {
    try {
        await axios.post(`${API_BASE_URL}/email`, { email });
    } catch (error) {
        console.error("이메일 전송 오류: ", error);
        throw error;
    }
};

// 인증 코드 검증 요청
export const verifyCode = async (email, verificationCode) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/email/verify`, { email, verificationCode });
        return response.data;
    } catch (error) {
        console.error("인증 코드 검증 오류: ", error);
        throw error;
    }
};

export const login = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include", // 세션 로그인 유지
        });

        if (!response.ok) {
            throw new Error("로그인 실패: 잘못된 아이디 또는 비밀번호");
        }

        const result = await response.json();

        localStorage.setItem("userId", result.userId);
        localStorage.setItem("username", result.username);
        localStorage.setItem("name", result.name);

        return result;
    } catch (error) {
        console.error("로그인 오류: ", error);
        throw error;
    }
};

export const logout = async () => {
    try{
        const response = await axios.post(`${API_BASE_URL}/logout`, {}, {withCredentials: true})

        return response.data;
    } catch (error) {
        console.error("로그아웃 실패", error);
        throw error;
    }
};