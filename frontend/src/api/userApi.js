import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/users";

export const deleteUser = async () => {
    try {
        const response = await axios.delete(`${API_BASE_URL}`, { withCredentials: true });

        return response.data;
    } catch (error) {
        console.error("회원 탈퇴 실패", error);
        throw error;
    }
};