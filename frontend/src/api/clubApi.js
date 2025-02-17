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