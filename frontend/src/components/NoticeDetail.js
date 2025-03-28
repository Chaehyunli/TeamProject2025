import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getNoticeDetail, getUserClubRole} from "../api/clubApi";
import {ProtectedImage} from "../api/uploadApi";

const NoticeDetail = () => {
    const {clubId, noticeId} = useParams();
    const navigate = useNavigate();
    const [notices, setNotices] = useState(null);
    const [isLeadership, setIsLeadership] = useState(false);

    useEffect(() => {
        const fetchNoticeDetail = async () => {
            try {
                const response = await getNoticeDetail(clubId, noticeId);
                console.log('서버 응답: ', response);
                setNotices(response);
            } catch (error){
                console.error('공지사항 상세 정보 조회 실패: ', error);
            }
        };

        const checkUserRole = async () => {
            try {
                const role = await getUserClubRole(clubId);
                console.log('현재 사용자 역할: ', role);

                setIsLeadership(role === 'PRESIDENT' || role === 'VICE_PRESIDENT');
                console.log('isLeadership: ', isLeadership);
            }catch (error) {
                console.error('역할 확인 실패');
            }
        }
        fetchNoticeDetail();
        checkUserRole();
    }, [clubId, noticeId]);

    const handleDelete = async () => {
        if(window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')){
            try {
                // await deleteNotice(clubId, noticeId);
                alert('공지사항이 삭제되었습니다.');
                navigate(`/clubs/${clubId}/notices`);
            }catch (error) {
                console.error('게시글 삭제 실패: ', error);
            }
        }
    };

    if(!notices){
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
                        <h1 className="text-2xl font-bold">{notices.noticeTitle}</h1>
                    </div>
                </div>

                {/* 본문 섹션 */}
                <div className="p-6">
                    <div className="p-6">
                        {/* 썸네일이 있을 때만 이미지 로딩 */}
                        {notices.thumbUrl && (
                            <div className="flex-shrink-0">
                                <ProtectedImage objectName={notices.thumbUrl} alt={notices.noticeTitle}/>
                            </div>
                        )}

                        {/* 본문 내용 */}
                        <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap">
                                {notices.noticeContents}
                            </div>
                        </div>
                    </div>

                    {/* 하단 버튼 섹션 */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-between">
                            <button
                                onClick={() => navigate(`/clubs/${clubId}/notices`)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                목록으로
                            </button>
                            <div className="flex space-x-4">
                                {/* 작성자인 경우 수정/삭제 버튼 표시 */}
                                {isLeadership ?
                                    (
                                        <div className="justify-center">
                                            <button
                                                onClick={() => navigate(`/clubs/${clubId}/notices/${noticeId}/edit`)}
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
                                    ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;