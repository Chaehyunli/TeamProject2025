import React from "react";

// 추후 데베에서 가져오는건 어떤가요?
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
            <label className="block text-sm font-medium text-extraText">학교</label>
            <select
                name="universityName"
                value={value}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-hoverBlueColor"
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
