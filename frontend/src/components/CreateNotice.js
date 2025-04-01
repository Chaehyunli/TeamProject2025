import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { uploadImageToGCP } from "../api/uploadApi";
import { createNotice } from "../api/clubApi";
import FileUpload from "./FileUpload";

const CreateNotice = () => {
    const navigate = useNavigate();
    const {clubId} = useParams();
    const [formData, setFormData] = useState({
        title: '',
        contents: '',
        thumbUrl: undefined
    });
    const [actionLoading, setActionLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name] : value
        }));
    };

    const handleSubmit = async (e) => {
        if (actionLoading) return;

        e.preventDefault();

        setActionLoading(true);

        try {
            let thumbUrl = null;

            if(formData.thumbUrl){
                thumbUrl = await uploadImageToGCP(formData.thumbUrl);
            }

            const noticeData = {
                title: formData.title,
                contents: formData.contents,
                thumbUrl: thumbUrl || undefined
            };

            await createNotice(clubId, noticeData);

            navigate(`/clubs/${clubId}/notices`, {state: { refreshed: true }});
        } catch (error){
            console.error("공지사항 작성 실패: ", error);
        } finally {
            setActionLoading(false);
        }
    };

    const allowedFileTypes = ["image/png", "image/jpeg"];
    const maxFileSize = 10 * 1024 * 1024;

    const handlefilechange = (file) => {
        if(file){
            if(!allowedFileTypes.includes(file.type)){
                console.log("PNG 또는 JPEG 파일만 업로드할 수 있습니다.");
                return;
            }

            if(file.size > maxFileSize){
                console.log("파일 크기는 최대 10MB까지 업로드 가능합니다.");
                return;
            }

            setFormData(prev => ({
                ...prev,
                thumbUrl: file
            }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">공지사항 작성</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 제목 입력 */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-extraText mb-2"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <label
                            htmlFor="contents"
                            className="block text-sm font-medium text-extraText mb-2"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="내용을 입력하세요"
                        />
                    </div>

                    {/* 썸네일 업로드 */}
                    <div>
                        <FileUpload
                            label="이미지 (선택사항)"
                            name="thumbUrl"
                            onFileSelect={handlefilechange}
                        />
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/clubs/${clubId}/notices`)}
                            className="px-4 py-2 text-sm font-medium text-extraText bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            // disabled={loading}
                            onClick={() => navigate(`/clubs/${clubId}/notices`)}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-hoverBlueColor rounded-md"
                        >
                            작성하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default  CreateNotice;

