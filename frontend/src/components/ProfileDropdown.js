import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ username, userImage, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            alert("로그아웃 되었습니다.");
            window.location.href = "/"; // 추후 변경, 로그인 페이지로
        } catch (error) {
            console.error("로그아웃 실패", error);
        }
    };

    return (
        <div className="relative">
            {/* 프로필 버튼 */}
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src={userImage} alt="User" className="w-8 h-8 rounded-full border" />
                <span className="text-gray-700">{username}</span>
                <FaChevronDown className={`text-gray-500 transition-transform ${isOpen ? "-rotate-180" : ""}`} />
            </div>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg">
                    <ul className="py-2 text-sm text-gray-700">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>내정보</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">나의 동아리</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>로그아웃</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
