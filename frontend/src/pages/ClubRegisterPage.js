import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClubRegistrationForm from "../components/ClubRegisterForm";
import { createClub } from "../api/clubApi";

const ClubRegistration = () => {
    const navigate = useNavigate();
    const [presidentName, setPresidentName] = useState("");

    useEffect(() => {
        // 로그인한 사용자 이름 가져오기
        const storedName = localStorage.getItem("name");
        if (storedName) {
            setPresidentName(storedName);
        } else {
            navigate("/login"); // 로그인되지 않았으면 로그인 페이지로 이동
        }
    }, [navigate]);

    // 동아리 등록 신청 핸들러
    const handleSubmit = async (formData) => {
        try {
            const response = await createClub(formData);
            alert("동아리가 성공적으로 등록되었습니다!");
            navigate("/home"); // 등록 성공 시 홈으로 이동
        } catch (error) {
            console.error("동아리 등록 오류:", error);
            alert("동아리 등록 중 오류가 발생했습니다.");
        }
     };
    //bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300

    return (
        <div className="max-w-2xl mx-auto my-28 px-6 py-12">
            <h1 className="text-3xl font-bold">동아리 등록 신청</h1>
            <div className="mt-4">
                <ClubRegistrationForm presidentName={presidentName} onSubmit={handleSubmit}/>
            </div>
        </div>
    );
};

export default ClubRegistration;
