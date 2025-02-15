import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../api/userApi";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        studentId: "",
        department: "",
        email: "",
        profileImage: ""
    });

    // 기존 프로필 정보를 가져와 user 상태에 저장
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserProfile();
                console.log("불러온 사용자 정보:", userData);
                setUser(userData.data || userData); // user 상태 업데이트
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
                profileImage: user.profileImage || ""
            });
        }
    }, [user]); // user가 변경될 때 실행

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // 변경된 값만 서버로 전송
    const handleSave = async () => {
        if (!user) return;

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
            await updateUserProfile(updatedFields); // PATCH 요청
            alert("프로필이 업데이트되었습니다.");
            navigate("/profile"); // 프로필 페이지로 이동
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
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">학번</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">학과</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">프로필 이미지 URL</label>
                    <input
                        type="text"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleChange}
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


