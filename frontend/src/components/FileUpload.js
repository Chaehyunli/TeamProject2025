import React from "react";
import InputField from "./InputField";

const FileUpload = ({ onFileSelect }) => {
    const handleChange = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            console.log("선택된 파일:", file.name, file.size, file.type); // 파일 정보 출력
            onFileSelect(file);
        }
    };

    return (
        <div className="mt-4">
            <InputField
                label="동아리 대표 사진"
                type="file"
                name="clubThumbnail"
                onChange={handleChange}
                accept="image/*"
            />
        </div>
    );
};

export default FileUpload;
