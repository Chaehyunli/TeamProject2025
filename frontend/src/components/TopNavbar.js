import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaRegBell } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/userApi";
import { logout } from "../api/authApi";

const TopNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("name")); // 초기 로그인 상태 설정
    const [username, setUsername] = useState(localStorage.getItem("name") || "");
    const [userImage, setUserImage] = useState(localStorage.getItem("profileImage") || "https://via.placeholder.com/50");
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();

    //  사용자 프로필 가져오기 (로그인 상태 확인)
    const fetchProfile = async () => {
        try {
            const response = await getUserProfile();
            if (response.data) {
                setIsLoggedIn(true);
                setUsername(response.data.name || "사용자");
                setUserImage(response.data.profileImage || "https://via.placeholder.com/50");

                localStorage.setItem("name", response.data.name);
                localStorage.setItem("profileImage", response.data.profileImage || "https://via.placeholder.com/50");
            }
        } catch (error) {
            console.error(`사용자 정보를 불러오지 못했습니다: ${error}`);
            setIsLoggedIn(false);
            localStorage.removeItem("name");
            localStorage.removeItem("profileImage");
        }
    };

    //  로그인 상태 변경 감지 (로그인/로그아웃 시 반영)
    useEffect(() => {
        fetchProfile(); //  첫 렌더링 시 프로필 불러오기

        const handleStorageChange = () => {
            fetchProfile(); //  localStorage 변경 감지 시 업데이트
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [isLoggedIn]); //  로그인 상태 변경될 때 실행되도록 설정

    //  검색 실행
    const handleSearch = () => {
        console.log("검색어:", searchQuery);
        inputRef.current.blur();
    };

    //  검색창에서 엔터키 입력 감지
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    //  로그아웃 처리
    const handleLogout = async () => {
        try {
            await logout();  // authApi에서 로그아웃 API 호출
            localStorage.clear();
            setIsLoggedIn(false);
            setUsername("");
            setUserImage("");

            // 상태 변경을 즉시 반영하기 위해 fetchProfile 재실행
            fetchProfile();

            window.dispatchEvent(new Event("storage")); // 상태 변경 감지
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패", error);
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full h-[72px] flex items-center border-b-[0.5px] border-black px-12 justify-between bg-white z-50 shadow-md">
            {/* 로고 및 메뉴 */}
            <div className="flex items-center gap-8">
                <span className="text-black text-base font-bold">NAME || LOGO</span>
                <a href="/home" className="text-black text-base font-bold hover:text-gray-700">홈</a>
                <a href="/clubs" className="text-[#717171] text-base font-normal hover:text-gray-700">등록신청</a>
                <a href="/chatrooms" className="text-[#717171] text-base font-normal hover:text-gray-700">채팅</a>
            </div>

            <div className="flex items-center gap-6">
                {/* 검색창 */}
                <div className="relative flex w-[248px] h-10 px-3 py-2 rounded-lg border-[0.5px] border-black">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="동아리 검색"
                        className="grow text-[#717171] text-base outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FaSearch className="text-gray-500 cursor-pointer" onClick={handleSearch} />
                </div>

                {/* 로그인 & 회원가입 또는 프로필 */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-8">
                        <FaRegBell className="text-gray-600 cursor-pointer" />
                        <ProfileDropdown username={username} userImage={userImage} onLogout={handleLogout} />
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button className="px-5 py-2 bg-white rounded-[15px] border-[0.5px] border-black text-black font-bold hover:bg-gray-100"
                                onClick={() => navigate("/login")}>
                            로그인
                        </button>
                        <button className="px-5 py-2 bg-[#65A3FF] rounded-[15px] text-white font-bold hover:bg-blue-500"
                                onClick={() => navigate("/register")}>
                            회원가입
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default TopNavbar;






