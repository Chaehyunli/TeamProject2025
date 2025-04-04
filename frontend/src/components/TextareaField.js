import React from "react";

const TextareaField = ({label, name, value, onChange, placeholder, required, rows=4, disabled}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows} // 기본적으로 4줄로 설정
                disabled={disabled}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
        </div>
    )
};

export default TextareaField;