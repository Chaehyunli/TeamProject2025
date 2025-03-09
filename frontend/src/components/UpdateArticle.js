import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleDetail, updateArticle } from '../api/clubApi';
import { uploadImageToGCP } from '../api/uploadApi';
import FileUpload from "./FileUpload";
import axios from "axios";

const UpdateArticle = () => {
    const navigate = useNavigate();
    const { clubId, articleId } = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        contents: '',
        thumbUrl: ''
    });

    // 기존 게시글 정보 불러오기
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await getArticleDetail(clubId, articleId);
                setFormData({
                    title: response.title,
                    contents: response.contents,
                    thumbUrl: response.thumbUrl || ''
                });
            } catch (error) {
                console.error('게시글 정보 불러오기 실패:', error);
                setErrorMessage('게시글 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchArticle();
    }, [clubId, articleId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = formData.thumbUrl;

            // 새로운 이미지가 업로드된 경우 (File 객체인지 확인)
            if (imageUrl instanceof File) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageUrl);

                const response = await uploadImageToGCP(imageFormData);
                if (response && response.imageUrl) {
                    imageUrl = response.imageUrl;
                } else {
                    throw new Error('이미지 업로드 실패');
                }
            } else if (imageUrl === '') {
                // 사용자가 이미지를 삭제한 경우
                imageUrl = null;
            }

            // 게시글 수정 요청
            const updateData = {
                title: formData.title,
                contents: formData.contents,
                thumbUrl: imageUrl,
            };

            await updateArticle(clubId, articleId, updateData);
            alert('게시글이 수정되었습니다.');
            navigate(`/clubs/${clubId}/articles/${articleId}`);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            setErrorMessage('게시글 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // const handleFileChange = (file) => {
    //     if (file) {
    //         if (!["image/png", "image/jpeg"].includes(file.type)) {
    //             setErrorMessage("PNG 또는 JPEG 파일만 업로드할 수 있습니다.");
    //             return;
    //         }
    //         if (file.size > 10 * 1024 * 1024) {
    //             setErrorMessage("파일 크기는 최대 10MB까지 업로드 가능합니다.");
    //             return;
    //         }
    //         setErrorMessage("");
    //         setFormData(prev => ({
    //             ...prev,
    //             thumbUrl: file
    //         }));
    //     }
    // };

    const handleFileChange = (fileOrEmptyString) => {
        if (fileOrEmptyString === '') {
            setFormData(prev => ({
                ...prev,
                thumbUrl: '',  // 이미지 삭제
            }));
            setErrorMessage('');
            return;
        }

        if (fileOrEmptyString instanceof File) {
            if (!["image/png", "image/jpeg"].includes(fileOrEmptyString.type)) {
                setErrorMessage("PNG 또는 JPEG 파일만 업로드할 수 있습니다.");
                return;
            }
            if (fileOrEmptyString.size > 10 * 1024 * 1024) {
                setErrorMessage("파일 크기는 최대 10MB까지 업로드 가능합니다.");
                return;
            }
            setErrorMessage("");
            setFormData(prev => ({
                ...prev,
                thumbUrl: fileOrEmptyString
            }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">게시글 수정</h2>
                {errorMessage && (
                    <div className="mb-4 text-red-500">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 제목 입력 */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            제목
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <label
                            htmlFor="contents"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            내용
                        </label>
                        <textarea
                            id="contents"
                            name="contents"
                            value={formData.contents}
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
                            onClick={() => navigate(`/clubs/${clubId}/articles/${articleId}`)}
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

export default UpdateArticle;