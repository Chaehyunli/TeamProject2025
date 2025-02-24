import ClubDetailNavbar from "../components/ClubDetailNavbar";
import { useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserClubRole } from "../api/clubApi";

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = await getUserClubRole(clubId);
                setUserRole(role);
            } catch (error) {
                console.error("사용자의 클럽 내 역할 정보를 불러오지 못했습니다.", error);
                setUserRole(null);
            }
        };

        fetchUserRole();
    }, [clubId]);

    return (
        <div className="p-4 pt-14">
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
