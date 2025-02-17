import React, { useState } from "react";
import FileUpload from "./FileUpload";
import InputField from "./InputField";

const ClubRegistrationForm = ({ presidentName, onSubmit }) => {
    const [clubName, setClubName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [thumbUrl, setThumbUrl] = useState(null);

    // 파일 업로드 핸들러
    const handleFileChange = (file) => {
        setThumbUrl(file);
    };

    // 폼 제출 핸들러
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ clubName, description, category, presidentName, thumbUrl });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-[600px] mx-auto">
            {/* 동아리 회장 이름 (자동 입력, 수정 불가) */}
            <label className="block text-sm font-medium text-gray-700">동아리 회장 이름</label>
            <input
                type="text"
                value={presidentName}
                disabled
                className="w-full px-4 py-2 border rounded-md bg-gray-100 shadow-sm"
            />

            {/* 동아리 이름 */}
            <InputField
                label="동아리 이름"
                type="text"
                name="clubName"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
                placeholder="동아리 이름을 입력하세요"
            />

            {/* 동아리 설명 */}
            <label className="block text-sm font-medium text-gray-700 mt-4">동아리 설명</label>
            <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="동아리 설명을 입력하세요"
            ></textarea>

            {/* 카테고리 */}
            <InputField
                label="카테고리"
                type="text"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="카테고리를 선택하세요"
            />

            {/* 파일 업로드 컴포넌트 */}
            <FileUpload onFileSelect={handleFileChange} />

            {/* 신청하기 버튼 */}
            <button
                type="submit"
                className="bg-primary text-white w-full mt-6 py-2 rounded-md hover:bg-hoverBlueColor transition duration-300"
            >
                신청하기
            </button>
        </form>
    );
};

export default ClubRegistrationForm;
