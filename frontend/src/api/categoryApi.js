import axios from "axios";
import API_BASE_URL from './api';

const CATEGORY_URL = `${API_BASE_URL}/api/v1/categories`;

// 카테고리 조회
export const getCategory = async() => {
    try{
        const response = await axios.get(`${CATEGORY_URL}`, { withCredentials: true });
        
        return response.data;
    } catch (error) {
        console.error("카테고리 정보 불러오기 실패: ", error);

        throw error;
    }
}