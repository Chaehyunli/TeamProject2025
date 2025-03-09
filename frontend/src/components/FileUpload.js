import React from "react";
import InputField from "./InputField";

const FileUpload = ({ label = "이미지 업로드", name = "image", onFileSelect }) => {
    const handleChange = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];

            if (!file.type.startsWith("image/")) {
                alert("❌ 지원하지 않는 파일 형식입니다. PNG, JPG만 업로드 가능합니다.");
                return;
            }

            console.log("선택된 파일:", file.name, file.size, file.type); // 파일 정보 출력
            onFileSelect(file);
        }
    };

    return (
        <div className="mt-4">
            <InputField
                label={label}
                type="file"
                name={name}
                onChange={handleChange}
                accept="image/*"
            />
        </div>
    );
};

export default FileUpload;