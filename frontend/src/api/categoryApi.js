import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/categories"

// 카테고리 조회
export const getCategory = async() => {
    try{
        const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
        
        return response.data;
    } catch (error) {
        console.error("카테고리 정보 불러오기 실패: ", error);

        throw error;
    }
}