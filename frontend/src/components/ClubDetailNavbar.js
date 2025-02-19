import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";

const ClubDetailNavbar = ({ clubId, userRole }) => {
    console.log("ClubDetailNavbar received userRole:", userRole); // props 확인

    const [selected, setSelected] = useState("게시물");
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 가져오기

    // 현재 경로에 따라 활성화된 버튼을 결정
    const getActiveTab = () => {
        if (location.pathname.includes("/notices")) return "공지사항";
        if (location.pathname.includes("/applicants")) return "지원자관리";
        if (location.pathname.includes("/permissions")) return "권한";
        if (location.pathname.includes("/apply")) return "지원하기";
        return "게시물"; // 기본값
    };

    // 기본 메뉴 (모든 사용자에게 표시)
    let menuItems = [
        { name: "게시물", path: `/clubs/${clubId}` },
        { name: "공지사항", path: `/clubs/${clubId}/notices` }
    ];

    // 회장 또는 부회장인 경우 추가 메뉴 표시
    if (userRole === "PRESIDENT" || userRole === "VICE_PRESIDENT") {
        menuItems.push({ name: "지원자관리", path: `/clubs/${clubId}/applicants` });
        menuItems.push({ name: "권한", path: `/clubs/${clubId}/permissions` });
    } else if (!userRole) {
        // 역할이 없으면 "지원하기" 버튼 추가
        menuItems.push({ name: "지원하기", path: `/clubs/${clubId}/apply` });
    }

    return (
        <div className="flex space-x-4 border-b pb-2">
            {menuItems.map((item) => (
                <button
                    key={item.name}
                    className={`px-4 py-2 ${getActiveTab() === item.name ? "text-black font-bold" : "text-gray-500"}`}
                    onClick={() => {
                        setSelected(item.name);
                        navigate(item.path);
                    }}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
};

export default ClubDetailNavbar;

