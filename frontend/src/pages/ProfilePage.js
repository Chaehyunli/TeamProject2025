import React, { useState, useEffect } from "react";
import { logout } from "../api/authApi";
import { deleteUser, getUserProfile, resetUserProfileImage } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { ProtectedImage } from "../api/uploadApi";
import Spinner from "../components/Spinner";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // 초기값을 null로 설정
    const [loading, setLoading] = useState(false);
    const [reseting, setResetting] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);


    useEffect(() => {
        // 현재 로그인된 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            setLoading(true);
            try {
                const userData = await getUserProfile();
                console.log("가져온 사용자 데이터:", userData);
                setUser(userData.data || userData); // 사용자 정보 업데이트
            } catch (error) {
                console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo(); // 컴포넌트가 마운트되면 실행
    }, []);

    const handleDeleteUser = async () => {
        if (!window.confirm("정말로 탈퇴하시겠습니까?")) return; // 확인 창

        setDeletingUser(true);
        try {
            await deleteUser();
            localStorage.removeItem("userId");  // userId 삭제
            localStorage.removeItem("username");  // username 삭제
            localStorage.removeItem("profileImage");  // profileImage 삭제
            localStorage.removeItem("name");  // 사용자 이름 삭제

            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "/"; // 탈퇴 후 홈 화면 이동
        } catch (error) {
            console.error("회원 탈퇴 실패", error);
            const errorMessage =
                error.response?.data?.message || "회원 탈퇴 중 알 수 없는 오류가 발생했습니다.";
            alert("회원 탈퇴 실패: " + errorMessage);
        } finally {
            setDeletingUser(false);
        }
    }; // 추후 추가, 메일 인증

    const handleLogout = async () => {
        const confirmLogout = window.confirm("정말로 로그아웃 하시겠습니까?");
        if (!confirmLogout) return;

        setLoggingOut(true);
        try {
            await logout();
            localStorage.removeItem("userId");  // userId 삭제
            localStorage.removeItem("username");  // username 삭제
            localStorage.removeItem("profileImage");  // profileImage 삭제
            localStorage.removeItem("name");  // 사용자 이름 삭제
            localStorage.removeItem("email");  // 사용자 이메일 삭제

            alert("로그아웃 되었습니다.");
            window.location.href = "/"
        } catch (error) {
            console.error("로그아웃 실패", error);
        } finally {
            setLoggingOut(false);
        }
    };

    const handleResetProfileImage = async () => {
        if (user.profileImage === "default-profileImage.png") {
            alert("이미 기본 이미지입니다."); // 이미 기본 이미지라면 알림만 표시하고 종료
            return;
        }

        if(!window.confirm("정말 기본 이미지로 설정하시겠습니까?")) return;

        setResetting(true);
        try {
            await resetUserProfileImage();
            const newProfileImage = "default-profileImage.png";

            // localStorage에 즉시 반영
            localStorage.setItem("profileImage", newProfileImage);

            setUser((prevUser) => ({
                ...prevUser,
                profileImage: newProfileImage,
            }));

            // `storage` 이벤트 트리거 (크롬 외 브라우저 대응)
            window.dispatchEvent(new Event("storage"));
        } catch (error) {
            console.error("❌ 기본 이미지 설정 실패:", error);
        } finally {
            setResetting(false);
        }
    }

    if (loading || !user) {
        return <Spinner />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-10">
            {/* 프로필 정보 */}
            <div className="flex justify-between items-start mt-8">
                <div className="flex items-center gap-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden border">
                        <ProtectedImage objectName={user.profileImage} alt="User" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <div className="flex justify-between items-start text-gray-500 w-full">
                            <div className="flex-1">
                                <p className="leading-snug">
                                    {user.universityName || "대학교 미입력"} | {user.studentId || "학번 미입력"} | {user.department || "학과 미입력"} | {user.email || "이메일 미입력"}
                                </p>
                            </div>

                            <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
                                <button
                                    className="px-3 py-1 text-xs text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                                    onClick={handleResetProfileImage}
                                >
                                    기본 이미지로 변경
                                </button>
                                <button
                                    className="px-3 py-1 text-xs text-white bg-primary rounded-lg hover:bg-hoverBlueColor whitespace-nowrap"
                                    onClick={() => navigate("/updateProfile")}
                                >
                                    수정
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 사용자 정보 목록 */}
            <div className="mt-6 space-y-6">
                <div className="flex justify-between text-lg">
                    <span className="font-semibold">아이디</span>
                    <span>{user.username}</span>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (!user || !user.username) {
                            alert("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
                            return;
                        }

                        navigate("/profile/update-pw", {
                            state: {
                                from: "profile",
                                universityName: user.universityName,
                                username: user.username,
                            },
                        });
                    }}
                    className="w-full text-left text-lg font-semibold text-primary hover:underline"
                >
                    비밀번호 변경
                </button>

                <div className="flex justify-between text-lg">
                    <span className="font-semibold">대학교 인증</span>
                    <span
                        className={`font-bold ${user.isEmailVerified ? "text-approvedTrueColor" : "text-pendingColor"}`}>
                        {user.isEmailVerified ? "인증 완료" : "미인증"}
                    </span>
                </div>

                <button className="w-full text-left text-lg font-semibold text-red-400 hover:underline"
                        onClick={handleDeleteUser}
                        disabled={deletingUser}
                >
                    회원 탈퇴
                </button>

                <button className="w-full text-left text-lg font-semibold text-warningText hover:underline"
                        onClick={handleLogout}
                        disabled={loggingOut}
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;