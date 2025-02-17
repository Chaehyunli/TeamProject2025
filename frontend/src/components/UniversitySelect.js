import React from "react";

const universities = [
    "서울대학교",
    "연세대학교",
    "고려대학교",
    "한양대학교",
    "성균관대학교",
    "명지대학교",
];

const UniversitySelect = ({ value, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">학교</label>
            <select
                name="universityName"
                value={value}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
                <option value="">학교를 선택하세요</option>
                {universities.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                ))}
            </select>
        </div>
    );
};

export default UniversitySelect;
