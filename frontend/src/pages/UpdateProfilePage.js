import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import UpdateProfileForm from "../components/UpdateProfileForm";
import { uploadImageToGCP } from "../api/uploadApi";

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
            if (formData.profileImage instanceof File) {
                const uploadedFileName = await uploadImageToGCP(formData.profileImage);
                updatedFields.profileImage = uploadedFileName;
            }

            await updateUserProfile(updatedFields);

            window.dispatchEvent(new Event("storage"));

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
        <div className="w-full flex flex-col items-center my-28 py-12">
            <UpdateProfileForm
                formData={formData}
                setFormData={setFormData}
                handleEmailChange={handleEmailChange}
                handleEmailVerificationSuccess={handleEmailVerificationSuccess}
                handleSave={handleSave}
            />
        </div>
    );
};

export default UpdateProfilePage;
