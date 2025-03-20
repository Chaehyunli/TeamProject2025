import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaRegBell } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserProfile } from "../api/userApi";
import { logout } from "../api/authApi";
import MainLogoForm from "./MainLogoForm";

const TopNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("name") || "");
    const [userImage, setUserImage] = useState(localStorage.getItem("profileImage") || "https://via.placeholder.com/50");
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 선택된 메뉴 상태 관리
    const [selectedMenu, setSelectedMenu] = useState("/home");

    // 현재 경로(location.pathname)를 기준으로 초기 선택된 메뉴 설정
    useEffect(() => {
        if (location.pathname.includes("/club-register")) setSelectedMenu("/club-register");
        else if (location.pathname.includes("/my-chatpage")) setSelectedMenu("/my-chatpage");
        else setSelectedMenu("/home");
    }, [location.pathname]);

    // 로그인된 사용자 정보 가져오기
    const fetchProfile = async () => {
        if (!localStorage.getItem("username")) {
            setIsLoggedIn(false);
            navigate("/login");

            localStorage.removeItem("name");
            localStorage.removeItem("profileImage");

            return;
        }

        try {
            const response = await getUserProfile();
            if (response.data) {
                setIsLoggedIn(true);
                setUsername(response.data.name);
                setUserImage(response.data.profileImage);

                localStorage.setItem("name", response.data.name);
                localStorage.setItem("profileImage", response.data.profileImage);
            }
        } catch (error) {
            console.error(`사용자 정보를 불러오지 못했습니다: ${error}`);
            setIsLoggedIn(false);
            localStorage.removeItem("name");
            localStorage.removeItem("profileImage");
        }
    };

    useEffect(() => {
        // if (location.pathname === "/login") {
        //     setIsLoggedIn(false);
        //     return;
        // }

        fetchProfile();

        const handleStorageChange = () => {
            fetchProfile();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [location.pathname]);

    // useEffect(() => {
    //     if (!isLoggedIn && location.pathname === "/profile") {
    //         navigate("/login");
    //     }
    // }, [isLoggedIn, location.pathname, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.clear();
            setIsLoggedIn(false);
            setUsername("");
            setUserImage("");
            window.dispatchEvent(new Event("storage"));
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
            inputRef.current.blur(); // 입력창 포커스 해제
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full h-[72px] flex items-center border-b-[0.5px] border-black px-12 justify-between bg-white z-50 shadow-md">
            {/* 로고 및 메뉴 */}
            <div className="flex items-center gap-8">
                <MainLogoForm />
                <button
                    onClick={() => {
                        navigate("/home");
                        setSelectedMenu("/home");
                    }}
                    className={`text-base font-bold ${
                        selectedMenu === "/home" ? "text-black" : "text-[#727272] hover:text-gray-700"
                    }`}
                >
                    홈
                </button>
                <button
                    onClick={() => {
                        navigate("/club-register");
                        setSelectedMenu("/club-register");
                    }}
                    className={`text-base font-bold ${
                        selectedMenu === "/club-register" ? "text-black" : "text-[#727272] hover:text-gray-700"
                    }`}
                >
                    등록신청
                </button>
                <button
                    onClick={() => {
                        navigate("/my-chatpage");
                        setSelectedMenu("/my-chatpage");
                    }}
                    className={`text-base font-bold ${
                        selectedMenu === "/my-chatpage" ? "text-black" : "text-[#727272] hover:text-gray-700"
                    }`}
                >
                    채팅
                </button>
            </div>

            <div className="flex items-center gap-6">
                {/* 검색창 */}
                <div className="relative flex w-[248px] h-10 px-3 py-2 rounded-lg border border-gray-400">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="동아리 검색"
                        className="grow text-extraText text-base outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FaSearch className="text-extraText cursor-pointer" onClick={handleSearch} />
                </div>

                {/* 로그인 & 회원가입 또는 프로필 */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-8">
                        <FaRegBell className="text-extraText cursor-pointer" />
                        <ProfileDropdown username={username} userImage={userImage} onLogout={handleLogout} />
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            className="px-5 py-2 bg-white rounded-lg border border-gray-300 text-black font-semibold hover:bg-hoverWhiteColor"
                            onClick={() => navigate("/login")}
                        >
                            로그인
                        </button>
                        <button
                            className="px-5 py-2 bg-primary rounded-lg border text-white font-semibold hover:bg-hoverBlueColor"
                            onClick={() => navigate("/register")}
                        >
                            회원가입
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default TopNavbar;