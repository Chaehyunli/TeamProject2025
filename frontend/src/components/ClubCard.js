import React from "react";
import { useNavigate } from "react-router-dom";
import { ProtectedImage } from "../api/uploadApi";

const ClubCard = ({ club, isMember }) => {
    const navigate = useNavigate();
    const president = club.leaders?.find(leader => leader.roleName === "PRESIDENT");
    const vicePresident = club.leaders?.find(leader => leader.roleName === "VICE_PRESIDENT");

    return (
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6 flex flex-col h-full justify-between">
            {/* 썸네일 */}
            <ProtectedImage objectName={club.thumbUrl} alt={club.clubName} />

            {/* 동아리 이름 */}
            <h3 className="text-xl font-bold mb-1 break-words">{club.clubName}</h3>

            {/* 회장 및 부회장 정보 */}
            <p className="text-gray-600 text-sm"><strong>회장:</strong> {president ? president.name : "미정"}</p>
            {vicePresident && <p className="text-gray-600 text-sm"><strong>부회장:</strong> {vicePresident.name}</p>}

            {/* 설명 */}
            <p className="text-gray-500 text-sm mt-2 break-words max-h-16 overflow-hidden">
                {club.description}
            </p>

            {/* 버튼 그룹 */}
            <div className="mt-4 flex gap-2">
                {/* 상세보기 버튼 */}
                <button
                    onClick={() => navigate(`/clubs/${club.clubId}`)}
                    className="flex-1 py-2 bg-white rounded-lg border border-gray-300 text-black font-semibold hover:bg-hoverWhiteColor whitespace-normal text-center"
                >
                    상세보기
                </button>

                {/* 지원하기 버튼 */}
                {!isMember && (
                    <button
                        onClick={() => navigate(`/clubs/${club.clubId}/apply`)}
                        className="flex-1 py-2 rounded-lg bg-primary text-white hover:bg-hoverBlueColor whitespace-normal text-center"
                    >
                        지원하기
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClubCard;
