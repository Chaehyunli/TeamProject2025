import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaRegBell } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import {useNavigate} from "react-router-dom";
// import { useLocation } from "react-router-dom"; // 추후 추가

const TopNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();
    // const location = useLocation(); // 추후 추가, 현재 페이지 경로 가져오기

    // 로그인 후 사용자 정보를 가져오는 함수 -> 추후 변경, 프로필 조회 api 사용
    const fetchProfile = () => {
        setIsLoggedIn(true);
        setUsername("홍길동");
        setUserImage("https://via.placeholder.com/50");
    };
    
    const handleSearch = () => {
        console.log("검색어:", searchQuery);
        inputRef.current.blur();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // const getNavLinkClass = (path) => {
    //     return location.pathname === path
    //         ? "text-black text-base font-bold" // 현재 페이지: 굵은 글씨 + 검정색
    //         : "text-[#727272] text-base font-normal hover:text-gray-700" // 현재 페이지 아닌 것: 일반 굵기 + 회색
    // };
    // 추후 변경

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername("");
        setUserImage("");
        navigate("/login");
    };

    return (
        <nav
            className="fixed top-0 left-0 w-full h-[72px] flex items-center border-b-[0.5px] border-black px-12 justify-between bg-white z-50 shadow-md">
            {/* 로고 및 메뉴 */}
            <div className="flex items-center gap-8">
                <span className="text-black text-base font-bold">NAME || LOGO</span>
                <span  className="text-black text-base font-bold hover:text-gray-700 cursor-pointer"
                       onClick={() => navigate("/home")}>
                    홈
                </span>
                <span className="text-[#717171] text-base font-normal hover:text-gray-700 cursor-pointer"
                      onClick={() => navigate("/clubs")}>
                    등록신청
                </span>
                <span className="text-[#717171] text-base font-normal hover:text-gray-700 cursor-pointer"
                      onClick={() => navigate("/chatrooms")}>
                    채팅
                </span>
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
                    <FaSearch className="text-gray-500 cursor-pointer"
                              onClick={handleSearch}
                    />
                </div>

                {/* 로그인 & 회원가입 또는 프로필 */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-8">
                        <FaRegBell className="text-gray-600 cursor-pointer"/> {/* 알림 아이콘 */}
                        <ProfileDropdown username={username} userImage={userImage} onLogout={handleLogout}/>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            className="px-5 py-2 bg-white rounded-[15px] border-[0.5px] border-black text-black font-bold hover:bg-gray-100"
                            onClick={() => navigate("/login")}>
                            로그인
                        </button>
                        <button
                            className="px-5 py-2 bg-[#65A3FF] rounded-[15px] text-white font-bold hover:bg-blue-500">
                            회원가입
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default TopNavbar;
