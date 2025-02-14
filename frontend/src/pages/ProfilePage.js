import React, { useState, useEffect } from "react";
import { logout } from "../api/authApi";
import { deleteUser, getUserProfile } from "../api/userApi";

const ProfilePage = () => {
    // 초기 사용자 정보 (API 연결 전 기본값 설정)
    // const [user, setUser] = useState({
    //     profileImage: "default_profile_url", // 기본 프로필 이미지 URL
    //     name: "홍길동",
    //     username: "gildong123",
    //     university: "명지대학교",
    //     is_uni_verified: false, // 대학교 인증 여부
    // });
    const [user, setUser] = useState(null); // 초기값을 null로 설정

    useEffect(() => {
        // 현재 로그인된 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserProfile();
                console.log("가져온 사용자 데이터:", userData);
                setUser(userData.data || userData); // 사용자 정보 업데이트
            } catch (error) {
                console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchUserInfo(); // 컴포넌트가 마운트되면 실행
    }, []);

    if (!user) {
        return <div className="text-center mt-10 text-lg">⏳ 로딩 중...</div>;
    }

    const handleDeleteUser = async () => {
        if (!window.confirm("정말로 탈퇴하시겠습니까?")) return; // 확인 창

        try {
            await deleteUser();
            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "/"; // 탈퇴 후 홈 화면 이동
        } catch (error) {
            console.error("회원 탈퇴 실패", error);
        }
    }; // 추후 추가, 메일 인증

    const handleLogout = async () => {
        try {
            await logout();
            alert("로그아웃 되었습니다.");
            window.location.href = "/"
        } catch (error) {
            console.error("로그아웃 실패", error);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-10">
            {/* 프로필 정보 */}
            <div className="flex justify-between items-start mt-8">
                <div className="flex items-center gap-4">
                    <img
                        src={user.profileImage || "default_profile_url"}
                        alt="프로필"
                        className="w-20 h-20 rounded-full border"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">{user.universityName || "대학교 미입력"}</p>
                    </div>
                </div>
            </div>

            {/* 사용자 정보 목록 */}
            <div className="mt-6 space-y-6">
                <div className="flex justify-between text-lg">
                    <span className="font-semibold">아이디</span>
                    <span>{user.username}</span>
                </div>

                <p className="text-lg font-semibold cursor-pointer text-[#65A3FF]">
                    비밀번호 변경
                </p>

                <div className="flex justify-between text-lg">
                    <span className="font-semibold">대학교 인증</span>
                    <span className={`font-bold ${user.isUniVerified ? "text-green-400" : "text-red-400"}`}>
                        {user.isUniVerified ? "인증 완료" : "미인증"}
                    </span>
                </div>

                <p className="text-lg font-semibold cursor-pointer text-black" onClick={ handleDeleteUser }>
                    회원 탈퇴
                </p>

                <p className="text-lg font-semibold cursor-pointer text-red-400" onClick={ handleLogout }>
                    로그아웃
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
