import React, { useState, useEffect } from 'react';
import InputField from "../components/InputField";
import {
    createComment,
    deleteComment,
    getCommentsByArticle,
    updateComment
} from "../api/commentApi";
import { getParticularUserProfile } from "../api/userApi";

const Comment = ({ articleId, currentUserId, userRole }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [parentId, setParentId] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [userProfiles, setUserProfiles] = useState({});

    useEffect(() => {
        if (articleId) {
            fetchComments();
        }
    }, [articleId]);

    const fetchComments = async () => {
        try {
            const res = await getCommentsByArticle(articleId);
            setComments(res);
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
            fetchComments();
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
                const isInsideEditArea = e.target.closest('.editing-comment-box');
                if (!isInsideEditArea) {
                    const confirmed = window.confirm("댓글 수정을 취소하시겠습니까?");
                    if (confirmed) {
                        setEditingCommentId(null);
                        setEditingContent('');
                        setOriginalContent('');
                    }
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
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReplyClick(c.commentId);
                        }}
                    >
                        {editingCommentId === c.commentId ? (
                            <div className="editing-comment-box" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    className="w-full border px-2 py-1 rounded mb-2"
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleEditSubmit} className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-hoverBlueColor">저장</button>
                                    <button onClick={handleEditCancel} className="px-2 py-1 text-xs bg-gray-300 text-black rounded hover:bg-extraText">취소</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`font-medium ${c.deleted ? 'text-gray-400' : ''}`}>
                                    {c.content}
                                    {c.updatedAt && !c.deleted && (
                                        <span className="text-gray-400"> (수정됨)</span>
                                    )}
                                </div>
                                <div
                                    className="text-sm text-extraText">작성자: {userProfiles[c.userId]?.name}({userProfiles[c.userId]?.username})
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {c.updatedAt ? `최근 수정일자: ${new Date(c.updatedAt).toLocaleString()}` : `댓글 작성일자: ${new Date(c.createdAt).toLocaleString()}`}
                                </div>
                            </>
                        )}

                        {!c.deleted && (
                            <div className="absolute top-2 right-2 flex space-x-2">
                                {String(c.userId) === currentUserId && (
                                    <button onClick={(e) => { e.stopPropagation(); handleEditClick(c.commentId, c.content); }} className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-hoverBlueColor">수정</button>
                                )}
                                {(String(c.userId) === currentUserId || userRole === 'PRESIDENT') && (
                                    <button onClick={(e) => { e.stopPropagation(); handleCommentDelete(c.commentId); }} className="px-2 py-1 text-xs bg-warningButton text-white rounded hover:bg-hoverWarningButton">삭제</button>
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

    return (
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
    );
};

export default Comment;
