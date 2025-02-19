import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getClubList, getUserClubs} from "../api/clubApi";
import ClubList from "../components/ClubList";

const HomePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [clubs, setClubs] = useState([]);
    const [userClubs, setUserClubs] = useState([]);
    //const [isLoading, setIsLoading] = useState(true);
    // 아직 없는 API를 고려하여 userClubs 상태 제거

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
                setUserClubs(userClubData);
            } catch (error) {
                console.error("사용자의 동아리 목록 불러오기 실패:", error);
                setUserClubs([]); // 오류 발생 시 빈 배열로 설정
            }
        };

        fetchClubs();
        fetchUserClubs();

        // 추후 API가 추가되면 여기에 fetchUserClubs() 추가
        // const fetchUserClubs = async () => {
        //   const userClubData = await "소속된 동아리 정보 얻는 API 필요";
        //   setUserClubs(userClubData);
        // };
        // fetchUserClubs();
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
            {/* userClubs는 빈 배열로 설정 (API 추가 전),
             userClubs를 통해 사용자가 가입한 동아리인지 확인하여
             "지원하기" 버튼을 보이거나 숨기는 기능을 제공*/}
            <ClubList clubs={clubs} userClubs={userClubs} />
        </div>
    );
};

export default HomePage;
