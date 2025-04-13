import React from "react";
import InputField from "./InputField";
import EmailVerificationForm from "./EmailVerificationForm";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";


const UpdateProfileForm = ({ formData, setFormData, handleEmailChange, handleEmailVerificationSuccess, handleSave }) => {
    const navigate = useNavigate();

    const handleProfileImageUpload = (file) => {
        setFormData((prevData) => ({
            ...prevData,
            profileImage: file, // 업로드된 파일을 formData에 반영
        }));
    };

    return (
        <div className="w-96">
            <h1 className="text-2xl font-bold mb-6 text-left">프로필 수정</h1>
            <div className="space-y-4">
                <InputField
                    label="이름"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />

                <InputField
                    label="학번"
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    //onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    disabled={true}
                />

                <InputField
                    label="학과"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                />

                {/* 이메일 인증 */}
                <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-left">이메일</label>
                    <EmailVerificationForm
                        onVerificationSuccess={handleEmailVerificationSuccess}
                        initialEmail={formData.email}
                        onEmailChange={handleEmailChange}
                    />
                    {formData.isEmailVerified ? (
                        <p className="text-green-500 text-sm mt-1">✅ 이메일 인증 완료</p>
                    ) : (
                        <p className="text-red-500 text-sm mt-1">❌ 이메일 인증이 필요합니다.</p>
                    )}
                </div>

                <FileUpload
                    label="프로필 사진 업로드"
                    name="profileImage"
                    onFileSelect={handleProfileImageUpload}
                />
            </div>

            {/* 버튼 추가 */}
            <div className="flex justify-end mt-6 space-x-4">
                <button
                    className="px-4 py-2 text-extraText bg-gray-100 hover:bg-gray-200 rounded-md"
                    onClick={() => navigate("/profile")}
                >
                    취소
                </button>
                <button
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-hoverBlueColor"
                    onClick={handleSave}
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default UpdateProfileForm;
