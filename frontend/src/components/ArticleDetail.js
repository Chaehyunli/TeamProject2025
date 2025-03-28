import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getArticleDetail,
    deleteArticle,
    getUserClubRole
} from '../api/clubApi';
import { ProtectedImage } from "../api/uploadApi";
import Comment from "../components/Comment";

const ArticleDetail = () => {
    const { clubId, articleId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLeadership, setIsLeadership] = useState(false);
    const [articleUserId, setArticleUserId] = useState();
    const currentUserId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticleDetail = async () => {
            if (loading) return;

            setLoading(true);
            try {
                const response = await getArticleDetail(clubId, articleId);
                console.log('서버 응답:', response); // 서버 응답 확인용 로그
                setArticle(response);
            } catch (error) {
                console.error('게시글 상세 정보 조회 실패:', error);
                setErrorMessage('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        const checkUserRole = async () => {
            if (loading) return;

            try {
                const role = await getUserClubRole(clubId);
                setUserRole(role);
                console.log('현재 사용자 역할: ', role);
                setIsLeadership(role === 'PRESIDENT' || role === 'VICE_PRESIDENT');
                console.log('isLeadership: ', isLeadership);
            } catch (error) {
                console.error('역할 확인 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetail();
        checkUserRole();
    }, [clubId, articleId]);

    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await deleteArticle(clubId, articleId);
                alert('게시글이 삭제되었습니다.');
                navigate(`/clubs/${clubId}/articles`);
            } catch (error) {
                console.error('게시글 삭제 실패:', error);
                setErrorMessage('게시글 삭제에 실패했습니다.');
            }
        }
    };

    if (errorMessage) {
        return <div className="text-center bg-warningText p-4">{errorMessage}</div>;
    }

    if (loading || !article) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
                {/* 헤더 섹션 */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold">{article.title}</h1>
                </div>

                {/* 본문 섹션 */}
                <div className="p-6">
                    {/* 썸네일이 있을 때만 이미지 로딩 */}
                    {article.thumbUrl && (
                        <div className="mb-4">
                            <ProtectedImage objectName={article.thumbUrl} alt={article.title} />
                        </div>
                    )}
                    {/* 본문 내용 */}
                    <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap">
                            {article.contents}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 섹션 */}n
                <div className="p-6 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={() => navigate(`/clubs/${clubId}/articles`)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        목록으로
                    </button>
                    {(String(article.author.authorId) === currentUserId || isLeadership) && (
                        <div className="flex gap-2">
                            {String(article.author.authorId) === currentUserId && (
                                <button
                                    onClick={() => navigate(`/clubs/${clubId}/articles/${articleId}/edit`)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-hoverBlueColor rounded-md"
                                >
                                    수정
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-warningButton hover:bg-hoverWarningButton rounded-md"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>

                {/* 댓글 컴포넌트 */}
                <Comment
                    articleId={articleId}
                    currentUserId={currentUserId}
                    userRole={userRole}
                />
            </div>
        </div>
    );
};

export default ArticleDetail;
