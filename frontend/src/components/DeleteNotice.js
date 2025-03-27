import {useNavigate, useParams} from "react-router-dom";
import React from "react";
import {deleteNotice} from "../api/clubApi";

const DeleteNotice = () => {
    const {clubId, noticeId} = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteNotice(clubId, noticeId);
            navigate(`/clubs/${clubId}/notices`);
        } catch (error){
            console.error('게시글 삭제 실패: ', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">공지사항 삭제</h2>

                <p className="text-gray-600 mb-6">
                    정말로 이 공지사항을 삭제하시겠습니까?
                    삭제된 공지사항은 복구할 수 없습니다.
                </p>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => navigate(`/clubs/${clubId}/notices/${noticeId}`)}
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

export default DeleteNotice;