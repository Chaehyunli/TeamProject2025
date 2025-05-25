import axios from 'axios';
import API_BASE_URL from "./api";

const COMMENT_URL = `${API_BASE_URL}/api/v1/comment/articles`;

// 댓글 작성
export const createComment = async (articleId, content, parentId = null) => {
    try {
        const response = await axios.post(`${COMMENT_URL}/${articleId}`, {
            content,
            parentId,
        }, {
            withCredentials: true
        });
        console.log("댓글 작성 응답:", response);
        return response.data.data; // commentId 등 반환
    } catch (error) {
        console.error("댓글 작성 실패:", error);
        throw error;
    }
};

// 댓글 수정
export const updateComment = async (commentId, content) => {
    try {
        const response = await axios.patch(`${COMMENT_URL}/${commentId}`, {
            content,
        }, {
            withCredentials: true
        });
        console.log("댓글 수정 응답:", response);
        return response.data.data;
    } catch (error) {
        console.error("댓글 수정 실패:", error);
        throw error;
    }
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(`${COMMENT_URL}/${commentId}`, {
            withCredentials: true
        });
        console.log("댓글 삭제 응답:", response);
        return response.data.data;
    } catch (error) {
        console.error("댓글 삭제 실패:", error);
        throw error;
    }
};

// 댓글 조회 (트리 구조)
export const getCommentsByArticle = async (articleId) => {
    try {
        const response = await axios.get(`${COMMENT_URL}/${articleId}/comments`, {
            withCredentials: true
        });
        console.log("댓글 조회 응답:", response);
        return response.data.data ?? []; // 트리 구조 댓글 리스트
    } catch (error) {
        console.error("댓글 조회 실패:", error);
        return [];
    }
};
