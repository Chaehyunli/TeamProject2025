import React from "react";
import InputField from "./InputField";

const ProfileForm = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <InputField
                label="이름"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <InputField
                label="학번"
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
            />
            <InputField
                label="학과"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
            />
            <InputField
                label="이메일"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <InputField
                label="프로필 이미지 URL"
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
            />
        </div>
    );
};

export default ProfileForm;
