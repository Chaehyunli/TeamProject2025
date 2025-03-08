import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { ProtectedImage } from "../api/uploadApi";

const ProfileDropdown = ({ username, userImage, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("userId");  // userId 삭제
            localStorage.removeItem("username");  // username 삭제
            localStorage.removeItem("profileImage");  // profileImage 삭제
            localStorage.removeItem("name");  // 사용자 이름 삭제

            alert("로그아웃 되었습니다.");
            window.location.href = "/login";
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
                <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <ProtectedImage objectName={userImage} alt="User" className="w-full h-full object-cover" />
                </div>
                <span className="text-black">{username}</span>
                <FaChevronDown className={`text-extraText transition-transform ${isOpen ? "-rotate-180" : ""}`} />
            </div>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg">
                    <ul className="py-2 text-sm text-black">
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => navigate("/profile")}>내정보
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">나의 동아리</li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => navigate("/users/submissions")}>나의 지원서
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>로그아웃</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;