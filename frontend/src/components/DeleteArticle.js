// frontend/src/components/DeleteArticle.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteArticle } from '../api/clubApi';

const DeleteArticle = () => {
    const navigate = useNavigate();
    const { clubId, articleId } = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    const handleDelete = async () => {
        try {
            await deleteArticle(clubId, articleId);
            navigate(`/clubs/${clubId}/articles`);
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            setErrorMessage('게시글 삭제에 실패했습니다.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">게시글 삭제</h2>

                <p className="text-gray-600 mb-6">
                    정말로 이 게시글을 삭제하시겠습니까?
                    삭제된 게시글은 복구할 수 없습니다.
                </p>

                {errorMessage && (
                    <div className="mb-4 text-red-500">
                        {errorMessage}
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => navigate(`/clubs/${clubId}/articles/${articleId}`)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteArticle;