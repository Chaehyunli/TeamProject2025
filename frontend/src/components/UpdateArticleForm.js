import React from "react";
import FileUpload from "./FileUpload";

const UpdateArticleForm = ({
                               formData,
                               handleChange,
                               handleFileChange,
                               handleSubmit,
                               actionLoading,
                               onCancel
                           }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 입력 */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="제목을 입력하세요"
                />
            </div>

            {/* 내용 입력 */}
            <div>
                <label htmlFor="contents" className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                <textarea
                    id="contents"
                    name="contents"
                    value={formData.contents}
                    onChange={handleChange}
                    required
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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

            {/* 버튼 */}
            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    disabled={actionLoading}
                >
                    수정하기
                </button>
            </div>
        </form>
    );
};

export default UpdateArticleForm;
