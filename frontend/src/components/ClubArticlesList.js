import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getClubArticles, getUserRoleInClub } from "../api/clubApi";
import { ProtectedImage } from "../api/uploadApi";
import UserNameFine from "./UserNameFine";

const ClubArticlesList = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isClubMember, setIsClubMember] = useState(false);
    const limit = 10; // 한 페이지당 게시글 수
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const location = useLocation();
    const [hasRefreshed, setHasRefreshed] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, [clubId, currentPage]);

    useEffect(() => {
        if (location.state?.refreshed && !hasRefreshed) {
            fetchArticles(); // 새로 작성된 글까지 반영
            setHasRefreshed(true);
            navigate(location.pathname, { replace: true });
        }
    }, [location, hasRefreshed]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const offset = currentPage * limit;
            const response = await getClubArticles(clubId, limit, offset);
            const role = await getUserRoleInClub(clubId);


            console.log('사용자 role', role);
            if (role === "NO_ROLE"){
                setIsClubMember(false);
            }else{
                setIsClubMember(true);
            }
            console.log('role boolean', isClubMember);

            // 응답 구조 확인
            console.log('게시물 목록 응답:', response);
            setArticles(response.articles);

            console.log('article list', articles);

            setTotalPages(Math.ceil(response.pagination.total / limit));
            setTotal(response.pagination.total);
        } catch (error) {
            console.error("게시물 목록 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {isClubMember && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate(`/clubs/${clubId}/articles/create`)}
                        className="bg-primary hover:bg-hoverBlueColor text-white px-4 py-2 rounded-lg"
                    >
                        게시물 작성
                    </button>
                </div>
            )}

            {/* 게시물 목록 */}
            <div className="bg-white shadow-md rounded-lg">
                {articles.length === 0 ? (
                    <div className="text-center py-8 text-extraText">
                        게시물이 없습니다.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {articles.toReversed().map((article) => (
                            <div
                                key={article.articleId}
                                onClick={() => navigate(`/clubs/${clubId}/articles/${article.articleId}`)}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                            >
                                {/* 썸네일이 있을 때만 이미지 로딩 */}
                                {article.thumbUrl && (
                                    <div className="flex-shrink-0">
                                        <ProtectedImage objectName={article.thumbUrl} alt={article.title} />
                                    </div>
                                )}

                                {/* 게시물 정보 */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">
                                        {article.title}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>작성자 :&nbsp;</span>
                                    <span><UserNameFine articles={article} /></span>
                                    <span>({article.author.authorName})</span>
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

export default ClubArticlesList;