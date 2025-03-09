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

// 프로필 수정
export const updateUserProfile = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("프로필 업데이트 실패");
        }

        return await response.json();
    } catch (error) {
        console.error("프로필 업데이트 오류:", error);
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

// 회원 목록 가져오기
export const fetchUserList = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/list`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error("❌ 회원 목록 불러오기 실패:", error);
        throw error;
    }
};

// 나의 지원서 목록 조회
export const getMySubmissions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/submissions`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("나의 지원서 목록 조회 실패:", error);
        throw error;
    }
};

// 나의 지원서 상세 조회
export const getMySubmissionDetail = async (applyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/submissions/${applyId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("나의 지원서 상세 조회 실패:", error);
        throw error;
    }
};

// 나의 지원서 수정
export const updateMySubmission = async (applyId, data) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/submissions/${applyId}`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }, // JSON 요청 명확히 지정
        });
        return response.data;
    } catch (error) {
        console.error("나의 지원서 수정 실패:", error);
        throw error;
    }
};

// 나의 지원서 삭제
export const deleteMySubmission = async (applyId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/submissions/${applyId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("나의 지원서 삭제 실패:", error);
        throw error;
    }
};

// 특정 사용자 프로필 조회
export const getParticularUserProfile = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userId}/profile`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("특정 사용자 프로필 조회 실패:", error);
        throw error;
    }
};