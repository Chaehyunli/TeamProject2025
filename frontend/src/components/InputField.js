import React from "react";

const InputField = ({ label, type, name, value, onChange, placeholder, required, pattern, accept, disabled }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={type === "file" ? undefined : value} // 파일 입력일 경우 `value`를 직접 제어하지 않음
                onChange={onChange}
                required={required}
                pattern={pattern}
                placeholder={placeholder}
                accept={accept} // 파일 업로드의 경우 확장자 필터 적용
                disabled={disabled} // 비활성화 속성 적용
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
        </div>
    );
};

export default InputField;
