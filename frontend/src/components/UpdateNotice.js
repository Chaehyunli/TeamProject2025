import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getNoticeDetail, updateArticle, updateNotice} from "../api/clubApi";
import {uploadImageToGCP} from "../api/uploadApi";
import FileUpload from "./FileUpload";

const UpdateNotice = () => {
    const {clubId, noticeId} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        noticeTitle: '',
        noticeContents: '',
        thumbUrl: ''
    });

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await getNoticeDetail(clubId, noticeId);
                setFormData({
                    noticeTitle: response.noticeTitle,
                    noticeContents: response.noticeContents,
                    thumbUrl: response.thumbUrl || ''
                });
            } catch (error) {
                console.error('게시글 정보 불러오기 실패: ', error);
            }
        };

        fetchNotice();
    }, [clubId, noticeId]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            let imageUrl = formData.thumbUrl;

            if (imageUrl instanceof File) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageUrl);

                const response = await uploadImageToGCP(imageFormData);
                if (response && response.imageUrl) {
                    imageUrl = response.imageUrl;
                } else {
                    throw new Error('이미지 업로드 실패');
                }
            }
            // 게시글 수정 요청
            const updateData = {
                noticeTitle: formData.noticeTitle,
                noticeContents: formData.noticeContents,
                thumbUrl: imageUrl || null, // 이미지가 없으면 null로 설정
            };

            await updateNotice(clubId, noticeId, updateData);
            alert('공지사항을 수정되었습니다.');
            navigate(`/clubs/${clubId}/notices/${noticeId}`);

        } catch (error) {
            console.error('공지사항 수정 실패:', error);
        }
    };

    const handleFileChange = (fileOrEmptyString) => {
        if (fileOrEmptyString === '') {
            setFormData(prev => ({
                ...prev,
                thumbUrl: '',  // 이미지 삭제
            }));
            return;
        }

        if (fileOrEmptyString instanceof File) {
            // 파일 유형 검사
            if (!["image/png", "image/jpeg"].includes(fileOrEmptyString.type)) {
                return;
            }

            // 파일 크기 검사
            if (fileOrEmptyString.size > 10 * 1024 * 1024) {
                return;
            }

            // 에러 메시지 초기화 및 폼 데이터 업데이트
            setFormData(prev => ({
                ...prev,
                thumbUrl: fileOrEmptyString
            }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">공지사항 수정</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 제목 입력 */}
                    <div>
                        <label
                            htmlFor="noticeTitle"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            제목
                        </label>
                        <input
                            id="noticeTitle"
                            type="text"
                            name="noticeTitle"
                            value={formData.noticeTitle}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <label
                            htmlFor="noticeContents"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            내용
                        </label>
                        <textarea
                            id="noticeContents"
                            name="noticeContents"
                            value={formData.noticeContents}
                            onChange={handleChange}
                            required
                            rows="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="내용을 입력하세요"
                        />
                    </div>

                    {/* 썸네일 업로드 */}
                    <div>
                        <FileUpload
                            label="썸네일 이미지 (선택사항)"
                            name="thumbUrl"
                            onFileSelect={handleFileChange}
                            currentImageUrl={typeof formData.thumbUrl === 'string' ? formData.thumbUrl : ''}
                        />
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/clubs/${clubId}/notices/${noticeId}`)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                            수정하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateNotice;