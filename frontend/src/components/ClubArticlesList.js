import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getClubArticles, getClubMembers} from "../api/clubApi";
import {getUserProfile} from "../api/userApi";

const ClubArticlesList = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const [name, setName] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isClubMember, setIsClubMember] = useState(false);
    const limit = 10; // 한 페이지당 게시글 수
    const currentUserId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        fetchArticles();
        checkClubMembership();
    }, [clubId, currentPage]);

    const fetchArticles = async () => {
        try {
            const offset = currentPage * limit;
            const response = await getClubArticles(clubId, limit, offset);
            const user = await getUserProfile();

            // 응답 구조 확인
            console.log('게시글 목록 응답:', response);
            console.log('첫 번째 게시글 데이터:', response.articles?.[0]);

            setName(user.data.name);
            setArticles(response.articles);
            setTotalPages(Math.ceil(response.pagination.total / limit));
            setError(null);
        } catch (error) {
            console.error("게시글 목록 조회 실패:", error);
            setError("게시글을 불러오는데 실패했습니다.");
        }
    };

    const checkClubMembership = async () => {
        try {
            const response = await getClubMembers(clubId);
            console.log('클럽 멤버 목록:', response); // 디버깅용

            // 현재 사용자가 멤버 목록에 있는지 확인
            const isMember = response.some(member => member.userId === currentUserId);
            if(isMember){
                setIsClubMember(true);
            }else {
                setIsClubMember(false);
            }
            // setIsClubMember(isMember);

            console.log('현재 사용자 ID:', currentUserId); // 디버깅용
            console.log('클럽 멤버 여부:', isMember); // 디버깅용
        } catch (error) {
            console.error("클럽 멤버 확인 실패:", error);
            setIsClubMember(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {!isClubMember && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate(`/clubs/${clubId}/articles/create`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        게시글 작성
                    </button>
                </div>
            )}

            {/* 게시글 목록 */}
            <div className="bg-white shadow-md rounded-lg">
                {articles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        게시글이 없습니다.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {articles.map((article) => (
                            <div
                                key={article.articleId}
                                onClick={() => navigate(`/clubs/${clubId}/articles/${article.articleId}`)}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">
                                        {article.title}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>작성자: {name}({article.author.authorName})</span>
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
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
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
                                        ? "bg-blue-500 text-white"
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
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
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
