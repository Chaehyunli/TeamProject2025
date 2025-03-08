import React, { useState } from "react";
import FileUpload from "./FileUpload";
import InputField from "./InputField";

const ClubRegistrationForm = ({ presidentName, onSubmit }) => {
    const [clubName, setClubName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [thumbUrl, setThumbUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // 카테고리 목록 (추후 DB에서 가져올 수 있음)
    const categories = ["IT/프로그래밍", "예술/공연", "봉사활동", "운동/스포츠", "학술/스터디", "창업", "기타"];

    // 허용되는 파일 형식
    const allowedFileTypes = ["image/png", "image/jpeg"];
    const maxFileSize = 10 * 1024 * 1024; // 10MB 제한

    // 파일 업로드 핸들러 (유효성 검사 포함)
    const handleFileChange = (file) => {
        if (file) {
            if (!allowedFileTypes.includes(file.type)) {
                setErrorMessage("PNG 또는 JPEG 파일만 업로드할 수 있습니다.");
                return;
            }
            if (file.size > maxFileSize) {
                setErrorMessage("파일 크기는 최대 10MB까지 업로드 가능합니다.");
                return;
            }
            setErrorMessage(""); // 오류 메시지 초기화
            setThumbUrl(file);
        }
    };

    // 폼 제출 핸들러 (페이지의 onSubmit 호출)
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            clubName,
            description,
            category,
            presidentName,
            thumbUrl,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto space-y-4">
            {/* 동아리 회장 이름 (자동 입력, 수정 불가) */}
            <InputField
                label="동아리 회장 이름"
                type="text"
                name="presidentName"
                value={presidentName}
                disabled={true}
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

            {/* 카테고리 선택 (드롭다운) */}
            <label className="block text-sm font-medium text-gray-700 mt-4">카테고리</label>
            <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
                <option value="">카테고리를 선택하세요</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            {/* 파일 업로드 컴포넌트 */}
            <FileUpload
                label="동아리 대표 사진 (선택사항)"
                name="clubThumbnail"
                onFileSelect={handleFileChange}
            />

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

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
