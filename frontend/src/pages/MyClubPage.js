import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserClubs, getClubList } from "../api/clubApi";
import ClubList from "../components/ClubList";

const MyClubsPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [userClubs, setUserClubs] = useState([]);
    const [allClubs, setAllClubs] = useState([]);

    useEffect(() => {
        if (!username) {
            navigate("/login");
            return;
        }

        const fetchUserClubs = async () => {
            try {
                const userClubData = await getUserClubs(); // 사용자의 동아리 목록 가져오기
                setUserClubs(userClubData);
            } catch (error) {
                console.error("사용자의 동아리 목록 불러오기 실패:", error);
                setUserClubs([]);
            }
        };

        const fetchAllClubs = async () => {
            try {
                const clubData = await getClubList(); // 모든 동아리 목록 가져오기
                setAllClubs(clubData);
            } catch (error) {
                console.error("전체 동아리 목록 불러오기 실패:", error);
                setAllClubs([]);
            }
        };

        fetchUserClubs();
        fetchAllClubs();
    }, [username, navigate]);

    // `userClubs` 데이터에 `allClubs` 데이터를 병합해서 이미지 & 회장 정보 추가
    const enrichedUserClubs = userClubs.map(userClub => {
        const fullClubData = allClubs.find(club => club.clubId === userClub.clubId);
        return {
            ...userClub,
            thumbUrl: fullClubData?.thumbUrl || "", // 이미지 URL 추가
            leaders: fullClubData?.leaders || []   // 회장/부회장 정보 추가
        };
    });

    return (
        <div className="container mx-auto px-8 lg:px-16">
            <div className="w-full h-48 bg-cover bg-center rounded-lg shadow-md mb-6 mt-24"
                 style={{ backgroundImage: "url('/banner.png')" }}>
                <div className="flex items-center justify-center h-full rounded-lg">
                    <h1 className="text-white text-3xl font-bold">내 동아리 목록</h1>
                </div>
            </div>

            <ClubList clubs={enrichedUserClubs} userClubs={enrichedUserClubs} />
        </div>
    );
};

export default MyClubsPage;

