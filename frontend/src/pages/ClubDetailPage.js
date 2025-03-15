import ClubDetailNavbar from "../components/ClubDetailNavbar";
import { useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserClubRole, getClub } from "../api/clubApi";
import { ProtectedImage } from "../api/uploadApi";
import DirectMessageButton from "../components/DirectMessageButton";

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const [club, setClub] = useState(null); // 동아리 정보
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                // 동아리 정보 및 사용자의 역할 정보를 동시에 가져옴
                const [clubData, role] = await Promise.all([
                    getClub(clubId),
                    getUserClubRole(clubId)
                ]);

                setClub(clubData);
                setUserRole(role);
            } catch (error) {
                console.error("❌ 동아리 정보를 불러오는 중 오류 발생:", error);
            }
        };

        fetchClubData();
    }, [clubId]);

    if (!club) return <div className="text-center text-red-500 py-10">❌ 클럽 정보를 불러올 수 없습니다.</div>;

    // 회장 및 부회장 정보 가져오기
    const president = club.leaders?.find(leader => leader.roleName === "PRESIDENT");
    const vicePresident = club.leaders?.find(leader => leader.roleName === "VICE_PRESIDENT");

    return (
        <div className="p-4 pt-14">
            {/* 동아리 기본 정보 (배경 이미지 포함) */}
            <div className="relative bg-white shadow-md rounded-lg my-6 overflow-hidden">
                {/* ProtectedImage를 사용하여 Presigned URL로 로드 */}
                {club.imageUrl && (
                    <div className="relative w-full h-60">
                        <ProtectedImage objectName={club.imageUrl} alt="Club Thumbnail"
                                        className="w-full h-full object-cover opacity-90" />

                        {/* 오버레이 및 텍스트 */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start text-white text-left pl-8">
                            <h1 className="text-3xl font-bold">{club.clubName}</h1>

                            {/* 회장 및 부회장 정보 */}
                            <div className="flex gap-2 mt-1">
                                <p className="text-lg text-gray-200">
                                    <strong>회장:</strong> {president ? president.userName : "미정"}
                                </p>
                                {vicePresident && (
                                    <p className="text-lg text-gray-300">
                                        <strong>부회장:</strong> {vicePresident.userName}
                                    </p>
                                )}
                            </div>

                            <DirectMessageButton presidentId={president.userId} receiverName={president.userName} />

                            <p className="text-lg mt-2 backdrop-blur-md">{club.description}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 네비게이션 바 */}
            <div className="mt-6">
                <ClubDetailNavbar clubId={clubId} userRole={userRole} />
            </div>

            {/* 본문: Outlet을 통해 페이지 변경 */}
            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
};

export default ClubDetailPage;
