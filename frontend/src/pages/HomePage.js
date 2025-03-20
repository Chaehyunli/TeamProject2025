import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getClubList, getUserClubs} from "../api/clubApi";
import ClubList from "../components/ClubList";

const HomePage = () => {
    const navigate = useNavigate();
    const [username] = useState(localStorage.getItem("username"));
    const [clubs, setClubs] = useState([]);
    const [userClubs, setUserClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            // 로그인 정보가 없으면 로그인 페이지로 이동
            navigate("/login");
            return;
        }

        const fetchClubs = async () => {
            try {
                const clubData = await getClubList();
                setClubs(clubData);
            } catch (error) {
                console.error("동아리 목록 불러오기 실패:", error);
            }
        };

        const fetchUserClubs = async () => {
            try {
                const userClubData = await getUserClubs(); // 사용자의 동아리 목록 요청
                setUserClubs(userClubData); // userClubs 상태 업데이트
            } catch (error) {
                console.error("사용자의 동아리 목록 불러오기 실패:", error);
                setUserClubs([]); // 오류 발생 시 빈 배열로 설정
            }
        };

        fetchClubs();
        fetchUserClubs();
    }, [username, navigate]);

    return (
        <div className="container mx-auto px-8 lg:px-16">
            {/* 상단 배너, 나중에 고정 이미지나 swiper 사용해서 자동 슬라이드 등 다양하게 변경 가능 */}
            <div className="w-full h-48 bg-cover bg-center rounded-lg shadow-md mb-6 mt-24"
                 style={{ backgroundImage: "url('/banner.png')" }}>
                <div className="flex items-center justify-center h-full rounded-lg">
                    <h1 className="text-white text-3xl font-bold">동아리를 찾아보세요!</h1>
                </div>
            </div>

            { clubs.length === 0 ? (
                // 동아리가 없을 때 메시지 표시
                <div className="text-center mt-10">
                    <p className="text-lg text-gray-600">아직 등록된 동아리가 없습니다.</p>
                    <p className="text-xl font-semibold text-gray-800 mt-2">
                        🏆 <span className="text-blue-500">최초의 동아리 등록자가 되어보세요!</span>
                    </p>
                    <button
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                        onClick={() => navigate("/club-register")}
                    >
                        동아리 등록하기
                    </button>
                </div>
            ) : (
                // 동아리가 있는 경우 목록 표시
                <ClubList clubs={clubs} userClubs={userClubs} />
            )}
        </div>
    );
};

export default HomePage;
