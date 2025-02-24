import React from "react";
import InputField from "./InputField";

const FileUpload = ({ label = "이미지 업로드", name = "image", onFileSelect }) => {
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
                label={label} // ✅ 라벨 동적으로 변경 가능
                type="file"
                name={name} // ✅ 입력 필드 이름도 변경 가능
                onChange={handleChange}
                accept="image/*"
            />
        </div>
    );
};

export default FileUpload;
