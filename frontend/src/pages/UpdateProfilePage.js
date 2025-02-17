import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import EmailVerificationForm from '../components/EmailVerificationForm';

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

    // 기존 프로필 정보를 가져와 user 상태에 저장
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserProfile();
                console.log("불러온 사용자 정보:", userData);
                setUser(userData.data || userData);
            } catch (error) {
                console.error("프로필 정보를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchUserInfo();
    }, []);

    // user 상태가 변경될 때 formData를 업데이트
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

    // 🔥 EmailVerificationForm에서 변경된 이메일을 받아오는 함수
    const handleEmailChange = (newEmail) => {
        setFormData((prevData) => ({
            ...prevData,
            email: newEmail,
            isEmailVerified: false // 이메일이 바뀌면 인증 초기화
        }));
    };

    // 이메일 인증 성공 시 상태 업데이트
    const handleEmailVerificationSuccess = (response) => {
        setFormData((prevData) => ({
            ...prevData,
            email: response.email,
            isEmailVerified: response.isEmailVerified,
        }));
    };

    // 변경된 값만 서버로 전송
    const handleSave = async () => {
        if (!user) return;

        // 이메일이 변경되었는데 인증이 안 되어 있으면 저장 불가
        if (formData.email !== user.email && !formData.isEmailVerified) {
            alert("이메일 변경 시 인증이 필요합니다.");
            return;
        }

        // 변경된 데이터만 수집
        const updatedFields = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== user[key]) {
                updatedFields[key] = formData[key];
            }
        });

        // 변경 사항이 없으면 요청하지 않음
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
        <div className="w-full max-w-4xl mx-auto mt-10 p-10">
            <h2 className="text-2xl font-bold mb-6">프로필 수정</h2>

            {/* 입력 필드 */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">이름</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">학번</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">학과</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* 이메일 인증 추가 */}
                <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium">이메일</label>
                    <div className="flex items-center gap-2 w-full">
                        <EmailVerificationForm
                            onVerificationSuccess={handleEmailVerificationSuccess}
                            initialEmail={formData.email}
                            onEmailChange={handleEmailChange} // 이메일 변경 시 반영
                        />
                    </div>
                    {formData.isEmailVerified ? (
                        <p className="text-green-500 text-sm mt-1">✅ 이메일 인증 완료</p>
                    ) : (
                        <p className="text-red-500 text-sm mt-1">❌ 이메일 인증이 필요합니다.</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">프로필 이미지 URL</label>
                    <input
                        type="text"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end mt-6 space-x-4">
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






