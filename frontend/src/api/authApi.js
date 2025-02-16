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
    try {
        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: "POST",
            credentials: "include", // 세션을 포함하여 요청
        });

        if (!response.ok) {
            throw new Error("로그아웃 실패");
        }

        localStorage.clear();
        window.dispatchEvent(new Event("storage")); // 상태 변경 감지 (TopNavbar 업데이트)
        return true;
    } catch (error) {
        console.error("로그아웃 실패", error);
        return false;
    }
};

export const resetPassword = async (formData) => {
    try{
        const response = await fetch(`${API_BASE_URL}/password-reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok){
            throw new Error(result.message);
        }

        return result;
    } catch(error) {
        console.error("비밀번호 재설정 오류: ", error); // 오류 메시지 출력
        throw error;
    }
}

// 아이디 검증 요청 (find-id API 호출) for reset-pw
export const verifyUsername = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/find-id`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                isEmailVerified: formData.isEmailVerified,
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }

        const foundUsername = result.data.username; // API 응답의 username

        if (!foundUsername) {
            throw new Error("서버 응답에서 아이디 정보를 찾을 수 없습니다.");
        }

        if (foundUsername !== formData.username) {
            console.error("아이디 불일치 오류 발생");
            throw new Error("등록되지 않은 아이디입니다.");
        }

    } catch (error) {
        throw error;
    }
};