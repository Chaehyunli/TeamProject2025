import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import EmailVerificationForm from "../components/EmailVerificationForm";
import InputField from "../components/InputField";

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        studentId: "",
        department: "",
        email: "",
        profileImage: "",
        isEmailVerified: false
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserProfile();
                setUser(userData.data || userData);
            } catch (error) {
                console.error("프로필 정보를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                studentId: user.studentId || "",
                department: user.department || "",
                email: user.email || "",
                profileImage: user.profileImage || "",
                isEmailVerified: user.isEmailVerified || false
            });
        }
    }, [user]);

    const handleEmailChange = (newEmail) => {
        setFormData((prevData) => ({
            ...prevData,
            email: newEmail,
            isEmailVerified: false
        }));
    };

    const handleEmailVerificationSuccess = (response) => {
        setFormData((prevData) => ({
            ...prevData,
            email: response.email,
            isEmailVerified: response.isEmailVerified,
        }));
    };

    const handleSave = async () => {
        if (!user) return;

        if (formData.email !== user.email && !formData.isEmailVerified) {
            alert("이메일 변경 시 인증이 필요합니다.");
            return;
        }

        const updatedFields = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== user[key]) {
                updatedFields[key] = formData[key];
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            alert("변경된 내용이 없습니다.");
            return;
        }

        try {
            await updateUserProfile(updatedFields);
            alert("프로필이 업데이트되었습니다.");
            navigate("/profile");
        } catch (error) {
            console.error("프로필 업데이트 실패", error);
            alert("업데이트에 실패했습니다.");
        }
    };

    if (!user) {
        return <div className="text-center mt-10 text-lg">⏳ 로딩 중...</div>;
    }

    return (
        <div className="w-full flex flex-col items-center mt-10 p-10">
            <div className="w-96">
                <h2 className="text-2xl font-bold mb-6 text-left">프로필 수정</h2>
            </div>

            <div className="space-y-4 w-96">
                <InputField
                    label="이름"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <InputField
                    label="학번"
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                />

                <InputField
                    label="학과"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />

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

                <InputField
                    label="프로필 이미지 URL"
                    type="text"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                />
            </div>

            <div className="flex justify-center mt-6 space-x-4">
                <button
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    onClick={() => navigate("/profile")}
                >
                    취소
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleSave}
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default UpdateProfilePage;








