import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getClubList, getNoticeList, getUserRoleInClub } from "../api/clubApi";
import { ProtectedImage } from "../api/uploadApi";
import UserNameFine from "./UserNameFine";

const NoticeList = () => {
    const {clubId} = useParams();
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPage] = useState(0);
    const [isLeadership, setIsLeadership] = useState(false);
    const [total, setTotal] = useState(0);
    const limit = 10;

    const location = useLocation();
    const [hasRefreshed, setHasRefreshed] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, [clubId, currentPage]);

    useEffect(() => {
        if (location.state?.refreshed && !hasRefreshed) {
            fetchNotices(); // 새로 작성된 글까지 반영
            setHasRefreshed(true);
            navigate(location.pathname, { replace: true });
        }
    }, [location, hasRefreshed]);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const offset = currentPage * limit;
            const response = await getNoticeList(clubId, limit, offset);
            const role = await getUserRoleInClub(clubId);

            setNotices(response.noticeList);
            setIsLeadership(role === 'PRESIDENT' || role === 'VICE_PRESIDENT');

            console.log('공지사항 List: ', response.noticeList);
            console.log('사용자 role', role);

            setTotalPage(Math.ceil(response.pagination.total / limit));

            setTotal(response.pagination.total);
            console.log('total: ', total);
        } catch (error) {
            console.error("공지사항 목록 조회 실패: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {isLeadership && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate(`/clubs/${clubId}/notices/create`)}
                        className="bg-primary hover:bg-hoverBlueColor text-white px-4 py-2 rounded-lg"
                    >
                        공지사항 작성
                    </button>
                </div>
            )}

            {/* 공지사항 목록 */}
            <div className="bg-white shadow-md rounded-lg">
                {notices.length === 0 ? (
                    <div className="text-center py-8 text-extraText">
                        공지사항이 없습니다
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {notices.toReversed().map((notice) => (
                            <div
                                key={notice.noticeId}
                                onClick={() => navigate(`/clubs/${clubId}/notices/${notice.noticeId}`)}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                            >
                                {/* 썸네일이 있을 때만 이미지 로딩 */}
                                {notice.thumbUrl && (
                                    <div className="flex-shrink-0">
                                        <ProtectedImage objectName={notice.thumbUrl} alt={notice.title}/>
                                    </div>
                                )}

                                {/* 공지사항 정보 */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">
                                        {notice.title}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>작성자: &nbsp;</span>
                                    <span><UserNameFine articles={notice} /></span>
                                    <span>({notice.author.authorName})</span>
                                </div>
                            </div>

                        ))}
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded ${
                            currentPage === 0
                                ? "bg-gray-200 text-extraText cursor-not-allowed"
                                : "bg-primary text-white hover:bg-hoverBlueColor"
                        }`}
                    >
                        이전
                    </button>
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`px-4 py-2 rounded ${
                                    currentPage === index
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className={`px-4 py-2 rounded ${
                            currentPage === totalPages - 1
                                ? "bg-gray-200 text-extraText cursor-not-allowed"
                                : "bg-primary text-white hover:bg-hoverBlueColor"
                        }`}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
};

export default NoticeList;