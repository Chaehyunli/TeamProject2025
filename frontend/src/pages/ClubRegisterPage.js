import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClubRegistrationForm from "../components/ClubRegisterForm";
import { createClub, getUserClubs } from "../api/clubApi";
import { uploadImageToGCP } from "../api/uploadApi";

const ClubRegisterPage = () => {
    const navigate = useNavigate();
    const [presidentName, setPresidentName] = useState("");
    const MAX_CLUBS_PER_PRESIDENT = 3; // 최대 개설 동아리 개수 제한
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        // 로그인한 사용자 이름 가져오기
        const storedName = localStorage.getItem("name");
        if (storedName) {
            setPresidentName(storedName);
        } else {
            navigate("/login"); // 로그인되지 않았으면 로그인 페이지로 이동
        }
    }, [navigate]);

    // 동아리 등록 신청 핸들러 (페이지에서 createClub 호출)
    const handleSubmit = async (formData) => {
        if (actionLoading) return;

        setActionLoading(true);
        try {
            const userClubs = await getUserClubs(); // 사용자가 속한 동아리 불러오기
            const presidentClubs = userClubs.filter(club => club.roleName === "PRESIDENT"); // 사용자가 개설한 동아리 찾기

            if (presidentClubs.length >= MAX_CLUBS_PER_PRESIDENT) {
                alert(`사용자당 최대 ${MAX_CLUBS_PER_PRESIDENT}개의 동아리만 개설할 수 있습니다.`);
                return;
            }

            let uploadedFileName = null;
            if (formData.thumbUrl) {
                uploadedFileName = await uploadImageToGCP(formData.thumbUrl); // UUID 적용된 파일명 반환
            }

            // 동아리 데이터에 파일 이름 추가 (Presigned URL은 서버에서 생성)
            const clubData = { ...formData, thumbUrl: uploadedFileName };
            await createClub(clubData);

            alert("동아리가 성공적으로 등록되었습니다!");
            navigate("/home");
        } catch (error) {
            console.error("동아리 등록 오류:", error);
            alert("동아리 등록 중 오류가 발생했습니다.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-28 px-6 py-12">
            <h1 className="text-3xl font-bold">동아리 등록 신청</h1>
            <div className="my-8">
                <ClubRegistrationForm presidentName={presidentName} onSubmit={handleSubmit} actionLoading={actionLoading} />
            </div>
        </div>
    );
};

export default ClubRegisterPage;
