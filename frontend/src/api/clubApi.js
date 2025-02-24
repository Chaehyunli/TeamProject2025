import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/clubs";

// 동아리 목록 조회
export const getClubList = async() => {
    try{
        const response = await axios.get(`${API_BASE_URL}`, {
            withCredentials: true // 세션 인증 유지 위해 추가
        });

        return response.data.data.clubs;
    } catch (error) {
        console.error("동아리 목록 불러오기 실패: ", error);
        return [];
    }
};

// 동아리 등록
export const createClub = async(clubData) => {
    try{
        const formData = new FormData();
        Object.entries(clubData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {  // null, undefined 방지
                formData.append(key, value);
            }
        });
        
        const response = await axios.post(`${API_BASE_URL}`, formData, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("동아리 생성 실패: ", error);
        throw error;
    }
};

// 동아리 내에서의 사용자 역할 반환
export const getUserClubRole = async (clubId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/role`, {
            withCredentials: true
        });

        const role = response.data.data.role;
        return role === "NO_ROLE" ? null : role; // NO_ROLE이면 null로 변환
    } catch (error) {
        console.error(`클럽 ${clubId}의 사용자 역할 가져오기 실패:`, error);
        return null;
    }
};

// 사용자가 가입한 동아리 목록 가져오기
export const getUserClubs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my-clubs`, { withCredentials: true });
        return response.data.data || []; // userClubs 배열 반환
    } catch (error) {
        console.error("사용자가 속한 동아리 목록 가져오기 실패:", error);
        return [];
    }
};

// 동아리 지원서 제출
export const submitClubApplication = async (clubId, formData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/${clubId}/submissions`,
            formData,
            { withCredentials: true } // 세션 기반 인증 유지
        );
        return response.data;
    } catch (error) {
        console.error("동아리 지원서 제출 실패:", error);
        throw error;
    }
};

// 사용자의 동아리 지원 여부 확인
export const getUserClubSubmissionStatus = async (clubId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/submissions/status`, {
            withCredentials: true
        });
        return response.data.data.hasApplied;
    } catch (error) {
        console.error("지원 여부 확인 실패:", error);
        return false;
    }
};

// 동아리 지원자 목록 조회 
export const getClubSubmissions = async (clubId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/submissions`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`동아리 ${clubId} 지원자 목록 불러오기 실패:`, error);
        return [];
    }
};

// 특정 동아리 정보 조회
export const getClub = async (clubId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}`, {
            withCredentials: true, // 세션 기반 인증 유지
        });
        return response.data.data; // ClubResponseDto 데이터 반환
    } catch (error) {
        console.error(`동아리 ${clubId} 정보 불러오기 실패:`, error);
        throw error;
    }
};