import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/users";

// 회원가입
export const register = async (formData) => {
    try{
        await axios.post(`${API_BASE_URL}/register`, formData, {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("회원가입 실패", error);
        throw error;
    }
}

//로그인된 사용자 정보 가져오기 API 호출
export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, { withCredentials: true });
        return response.data; // `CommonResponseDto`의 `data` 속성 반환
    } catch (error) {
        console.error("사용자 정보를 불러오지 못했습니다.", error);
        throw error;
    }
};

// 회원 탈퇴 기능
export const deleteUser = async () => {
    try {
        const response = await axios.delete(`${API_BASE_URL}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("회원 탈퇴 실패", error);
        throw error;
    }
};