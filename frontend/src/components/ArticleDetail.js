import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getArticleDetail,
    deleteArticle,
    getUserClubRole
} from '../api/clubApi';
import axios from "axios";

const ArticleDetail = () => {
    const { clubId, articleId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLeadership, setIsLeadership] = useState(false);
    const [articleUserId, setArticleUserId] = useState();
    const currentUserId = localStorage.getItem('userId'); // 현재 로그인한 사용자 ID


    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                const response = await getArticleDetail(clubId, articleId);
                console.log('서버 응답:', response); // 서버 응답 확인용 로그
                setArticle(response);

            } catch (error) {
                console.error('게시글 상세 정보 조회 실패:', error);
                setErrorMessage('게시글을 불러오는데 실패했습니다.');
            }
        };

        const checkUserRole = async () => {
            try {
                const role = await getUserClubRole(clubId);
                setUserRole(String(role));
                console.log('현재 사용자 역할: ', role);

                setIsLeadership(role === 'PRESIDENT' || role === 'VICE_PRESIDENT');
                console.log('isLeadership: ', isLeadership);
            } catch (error){
                console.error('역할 확인 실패');
            }
        }

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
        return (
            <div className="text-center text-red-500 p-4">
                {errorMessage}
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
                {/* 헤더 섹션 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex mb-4">
                        <h1 className="text-2xl font-bold">{article.title}</h1>
                    </div>
                </div>

                {/* 본문 섹션 */}
                <div className="p-6">
                    {/* 썸네일 이미지가 있는 경우에만 표시 */}
                    {article.thumbUrl ? (
                        <div className="mb-6">
                            <img
                                src={article.thumbUrl.startsWith('http') ? article.thumbUrl : `http://localhost:3000${article.thumbUrl}`}
                                alt="게시글 이미지"
                                className="max-w-full h-auto rounded-lg"
                                onError={(e) => e.target.src = '/default-image.png'} // 이미지 로딩 실패 시 기본 이미지 표시
                            />
                        </div>
                    ) : (
                        <div className="mb-6">
                            <img
                                src="/default-image.png"
                                alt="기본 이미지"
                                className="max-w-full h-auto rounded-lg"
                            />
                        </div>
                    )}


                    {/* 본문 내용 */}
                    <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap">
                            {article.contents}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 섹션 */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-between">
                        <button
                            onClick={() => navigate(`/clubs/${clubId}/articles`)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            목록으로
                        </button>
                        <div className="flex space-x-4">
                            {/* 작성자인 경우 수정/삭제 버튼 표시 */}
                            {String(article.author.authorId) === currentUserId
                                ? (
                                <div className="justify-center">
                                    <button
                                        onClick={() => navigate(`/clubs/${clubId}/articles/${articleId}/edit`)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                                    >
                                        삭제
                                    </button>
                                </div>
                            ) : isLeadership ? (
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                                >
                                    삭제
                                </button>
                            ) : null}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;


