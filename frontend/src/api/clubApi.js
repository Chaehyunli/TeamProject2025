import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/clubs";

// 동아리 목록 조회
export const getClubList = async() => {
    try{
        const response = await axios.get(`${API_BASE_URL}`, {
            withCredentials: true // 세션 인증 유지 위해 추가
        });

        console.log('clubs: ', response);
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
// 특정 지원서 상세정보 조회
export const getClubSubmissionDetail = async (clubId, applyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/submissions/${applyId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("지원서 상세 조회 실패:", error);
        throw error;
    }
};

// 특정 지원서 승인
export const approveSubmission = async (clubId, applyId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${clubId}/submissions/${applyId}/approve`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("지원서 승인 실패:", error);
        throw error;
    }
};

// 특정 지원서 거절
export const rejectSubmission = async (clubId, applyId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${clubId}/submissions/${applyId}/reject`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("지원서 거절 실패:", error);
        throw error;
    }
};

// 동아리 멤버 목록 가져오기
export const getClubMembers = async (clubId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/members`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("동아리 멤버 조회 실패:", error);
        throw error;
    }
};

// 동아리 게시물 작성
export const createArticle = async (clubId, articleData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/${clubId}/articles`,
            articleData,
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.error("동아리 게시물 작성 실패:", error);
        throw error;
    }
};

// 동아리 게시물 리스트
export const getClubArticles = async (clubId, limit = 10, offset = 0) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/articles`, {
            params: {
                limit,
                offset
            },
            withCredentials: true,
        });
        return response.data.data;
    } catch (error){
        console.error("동아리 게시글 목록 조회 실패: ", error);
        throw error;
    }
}

// 동아리 특정 게시물
export const getArticleDetail = async (clubId, articleId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${clubId}/articles/${articleId}`,
            { withCredentials: true }
        );
        console.log('clubApi authorId', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('게시글 상세 조회 실패:', error);
        throw error;
    }
};

// 동아리 게시물 삭제
export const deleteArticle = async (clubId, articleId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/${clubId}/articles/${articleId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('게시글 삭제 실패:', error);
        throw error;
    }
};

// 동아리 게시물 수정
export const updateArticle = async (clubId, articleId, articleData) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${clubId}/articles/${articleId}`,
            articleData,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('게시글 수정 실패:', error);
        throw error;
    }
};

export const getUserRoleInClub = async (clubId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/role`, {
            withCredentials: true
        });

        console.log('사용자 역할 확인 응답: ', response.data);
        return response.data.data.role;
    } catch (error) {
        console.error('동아리 멤버 조회 실패: ', error);
        throw error;
    }
};

export const createNotice = async (clubId, noticeData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/${clubId}/notices`,
            noticeData,
            {withCredentials: true}
        );
        return response.data;
    } catch (error) {
        console.error('공지사항 작성 실패: ', error)
        throw error;
    }
};

export const getNoticeDetail = async (clubId, noticeId) => {

    try {
        const response = await axios.get(
            `${API_BASE_URL}/${clubId}/notices/${noticeId}`,
            { withCredentials: true }
        );
        console.log('clubApi authorId', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('공지사항 상세 조회 실패:', error);
        throw error;
    }
};

export const getNoticeList = async (clubId, limit = 10, offset = 0) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${clubId}/notices`, {
            params: {
                limit,
                offset
            },
            withCredentials: true,
        });
        return response.data.data;
    } catch (error){
        console.log('동아리 공지사항 조회 실패: ', error);
        throw error;
    }
};

export const deleteNotice = async (clubId, noticeId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/${clubId}/notices/${noticeId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        throw error;
    }
};

export const updateNotice = async (clubId, noticeId, noticeData) => {

    try {
        const response = await axios.put(
            `${API_BASE_URL}/${clubId}/notices/${noticeId}`,
            noticeData,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('공지사항 수정 실패:', error);
        throw error;
    }
}



// 특정 동아리 Thumbnail 수정
export const updateClubThumbnail = async (clubId, objectName) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/${clubId}/thumbnail`,
            new URLSearchParams({ objectName }), // x-www-form-urlencoded 형식
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("동아리 썸네일 수정 실패:", error);
        throw error;
    }
};

// 기본 Thumbnail로 변경
export const resetClubThumbnail = async (clubId) =>{
  try {
      const response = await axios.patch(`${API_BASE_URL}/${clubId}/thumbnail/reset`,
          {},
          { withCredentials: true }
      );

      return response.data;
  } catch (error){
      console.log("기본 썸네일 설정 실패:", error);
      throw error;
  }
};

// 특정 회원에게 권한 부여
export const grantRole = async (targetUserId, clubId, role) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/grant-role`,
            { targetUserId, clubId, role },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.message;
    } catch (error) {
        console.error('권한 부여 실패: ', error);
        return error;
    }
};

// 특정 회원 강퇴
export const leaveClub = async (targetUserId, clubId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/leave-club`,
            {
                data: { targetUserId, clubId },
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",  // 명확한 설정
                },
            }
        );
        return response.data.message;
    } catch (error) {
        console.error('동아리 강퇴 실패: ', error);
        return error;
    }
};

// 검색어로 동아리 검색 (페이지네이션 고려 x)
export const getSearchClubList = async (searchQuery) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search`, {
            params: { search: searchQuery }, // 검색어만 전달
            withCredentials: true
        });

        return response.data.data.clubs;
    } catch (error) {
        console.error("동아리 검색 실패: ", error);
        return [];
    }
};

export const deleteClub = async (clubId) => {
    try {
        await axios.delete(`${API_BASE_URL}/${clubId}`, { withCredentials: true });
        return true;
    } catch (error){
        console.log("동아리 삭제 실패:", error);
        throw error;
    }
}