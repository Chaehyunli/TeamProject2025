import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getArticleDetail,
    deleteArticle,
    getUserClubRole
} from '../api/clubApi';
import { ProtectedImage } from "../api/uploadApi";
import {createComment, deleteComment, getCommentsByArticle, updateComment} from "../api/commentApi";
import InputField from "../components/InputField";
import {getParticularUserProfile} from "../api/userApi";

const ArticleDetail = () => {
    const {clubId, articleId} = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLeadership, setIsLeadership] = useState(false);
    const [articleUserId, setArticleUserId] = useState();
    const currentUserId = localStorage.getItem('userId'); // 현재 로그인한 사용자 ID
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]); // 댓글 불러오기
    const [newComment, setNewComment] = useState(''); // 새로 작성하는 댓글
    const [parentId, setParentId] = useState(null); // 대댓글의 부모 id
    const [selectedCommentId, setSelectedCommentId] = useState(null); // 대댓글을 작성할 댓글 선택
    const [editingCommentId, setEditingCommentId] = useState(null); // 수정된 댓글
    const [editingContent, setEditingContent] = useState(''); // 수정 중인 댓글
    const [originalContent, setOriginalContent] = useState(''); // 댓글 수정 여부 판단
    const [userProfiles, setUserProfiles] = useState({});

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

            setLoading(true);
            try {
                const role = await getUserClubRole(clubId);
                setUserRole(String(role));
                console.log('현재 사용자 역할: ', role);

                setIsLeadership(role === 'PRESIDENT' || role === 'VICE_PRESIDENT');
                console.log('isLeadership: ', isLeadership);
            } catch (error) {
                console.error('역할 확인 실패');
            } finally {
                setLoading(false);
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

    useEffect(() => {
        if (articleId) {
            fetchComments();
        }
    }, [articleId]);

    const fetchComments = async () => {
        try {
            const res = await getCommentsByArticle(articleId);
            setComments(res);

            // 유저 정보 캐싱 요청
            const userIdSet = new Set();
            const collectUserIds = (commentList) => {
                commentList.forEach(c => {
                    userIdSet.add(c.userId);
                    if (c.children) collectUserIds(c.children);
                });
            };
            collectUserIds(res);

            const newProfiles = { ...userProfiles };
            for (const userId of userIdSet) {
                if (!newProfiles[userId]) {
                    try {
                        const profileRes = await getParticularUserProfile(userId);
                        newProfiles[userId] = {
                            name: profileRes.data.name,
                            username: profileRes.data.username,
                        };
                    } catch (e) {
                        console.error("프로필 조회 실패", e);
                    }
                }
            }
            setUserProfiles(newProfiles);
        } catch (e) {
            console.error("댓글 조회 실패", e);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        const confirmed = window.confirm("댓글을 등록하시겠습니까?");
        if (!confirmed) return;

        try {
            await createComment(articleId, newComment, parentId);
            setNewComment('');
            setParentId(null);
            setSelectedCommentId(null);
            fetchComments(); // 새로고침
        } catch (e) {
            console.error("댓글 작성 실패", e);
        }
    };


    const handleReplyClick = (commentId) => {
        if (selectedCommentId === commentId) {
            setParentId(null);
            setSelectedCommentId(null);
        } else {
            setParentId(commentId);
            setSelectedCommentId(commentId);
        }
    };

    const handleCommentDelete = async (commentId) => {
        const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await deleteComment(commentId);
            fetchComments();
        } catch (e) {
            console.error("댓글 삭제 실패", e);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (editingCommentId !== null) {
                const confirmed = window.confirm("댓글 수정을 취소하시겠습니까?");
                if (confirmed) {
                    setEditingCommentId(null);
                    setEditingContent('');
                    setOriginalContent('');
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [editingCommentId]);

    const handleEditClick = (commentId, currentContent) => {
        setEditingCommentId(commentId);
        setEditingContent(currentContent);
        setOriginalContent(currentContent);
    };

    const handleEditCancel = () => {
        const confirmed = window.confirm("댓글 수정을 취소하시겠습니까?");
        if (!confirmed) return;
        setEditingCommentId(null);
        setEditingContent('');
        setOriginalContent('');
    };

    const handleEditSubmit = async () => {
        if (!editingContent.trim() || editingContent === originalContent) return;
        const confirmed = window.confirm("댓글을 수정하시겠습니까?");
        if (!confirmed) return;

        try {
            await updateComment(editingCommentId, editingContent);
            fetchComments();
            setEditingCommentId(null);
            setEditingContent('');
            setOriginalContent('');
        } catch (e) {
            console.error("댓글 수정 실패", e);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    const renderComments = (commentList) => {
        if (!Array.isArray(commentList)) return null;

        return (
            <ul className="ml-2 space-y-3">
                {commentList.map((c) => (
                    <li
                        key={c.commentId}
                        className={`relative border p-3 pr-24 rounded cursor-pointer ${selectedCommentId === c.commentId ? 'border-2 border-primary' : ''}`}
                        onClick={() => handleReplyClick(c.commentId)}
                    >
                        {editingCommentId === c.commentId ? (
                            <div>
                                <input
                                    type="text"
                                    className="w-full border px-2 py-1 rounded mb-2"
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditSubmit();
                                        }}
                                        className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-hoverBlueColor"
                                    >
                                        저장
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditCancel();
                                        }}
                                        className="px-2 py-1 text-xs bg-gray-300 text-black rounded hover:bg-gray-400"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`font-medium ${c.deleted ? 'text-gray-400' : ''}`}>
                                    {c.content} {c.updatedAt && !c.deleted && '(수정됨)'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    작성자: {userProfiles[c.userId]?.name}({userProfiles[c.userId]?.username})
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {c.updatedAt
                                        ? `최근 수정일자: ${new Date(c.updatedAt).toLocaleString()}`
                                        : `댓글 작성일자: ${new Date(c.createdAt).toLocaleString()}`}
                                </div>
                            </>
                        )}

                        {!c.deleted && (
                            <div className="absolute top-2 right-2 flex space-x-2">
                                {String(c.userId) === currentUserId && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(c.commentId, c.content);
                                        }}
                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        수정
                                    </button>
                                )}
                                {(String(c.userId) === currentUserId || userRole === 'PRESIDENT') && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCommentDelete(c.commentId);
                                        }}
                                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        )}

                        {c.children && c.children.length > 0 && (
                            <div className="ml-6 mt-2">
                                {renderComments(c.children)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    if (errorMessage) {
        return (
            <div className="text-center bg-warningText p-4">
                {errorMessage}
            </div>
        );
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
                    <div className="flex mb-4">
                        <h1 className="text-2xl font-bold">{article.title}</h1>
                    </div>
                </div>

                {/* 본문 섹션 */}
                <div className="p-6">
                    <div className="p-6">
                        {/* 썸네일이 있을 때만 이미지 로딩 */}
                        {article.thumbUrl && (
                            <div className="flex-shrink-0">
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
                                                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-hoverBlueColor rounded-md"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="px-4 py-2 text-sm font-medium text-white bg-warningButton hover:bg-hoverWarningButton rounded-md"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ) : isLeadership ? (
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 text-sm font-medium text-white bg-warningButton hover:bg-hoverWarningButton rounded-md"
                                        >
                                            삭제
                                        </button>
                                    ) : null}

                            </div>
                        </div>
                    </div>
                </div>
                {/* 댓글 작성 */}
                <div className="mt-8 p-6">
                    <h2 className="text-xl font-semibold mb-2">댓글</h2>
                    {parentId && (
                        <div className="mb-2 text-sm text-primary font-semibold">
                            대댓글 작성 중입니다. 선택한 댓글을 다시 누르면 취소됩니다.
                        </div>
                    )}
                    <div className="flex flex-1 space-x-2 mb-4 items-end">
                        <div className="flex-1">
                            <InputField
                                label={""}
                                type="text"
                                name="comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={parentId ? "대댓글을 입력하세요" : "댓글을 입력하세요"}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button
                            onClick={handleCommentSubmit}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-hoverBlueColor"
                        >
                            등록
                        </button>
                    </div>

                    {renderComments(comments)}
                </div>

            </div>
        </div>
    );
};

export default ArticleDetail;