import React from "react";

const InputField = ({ label, type, name, value, onChange, placeholder, required, pattern }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                pattern={pattern}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
        </div>
    );
};

export default InputField;
