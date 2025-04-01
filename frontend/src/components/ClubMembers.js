import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClubMembers, grantRole, leaveClub, getUserClubRole } from "../api/clubApi";
import { ProtectedImage } from "../api/uploadApi";
import { getParticularUserProfile } from "../api/userApi";
import Spinner from "./Spinner";

const ClubMembers = () => {
    const { clubId } = useParams();
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [roleLoading, setRoleLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null); // 현재 로그인한 사용자의 역할
    const [currentUserId, setCurrentUserId] = useState(null); // 현재 로그인한 사용자 ID

    useEffect(() => {
        const fetchMembers = async () => {
            if (membersLoading) return;

            setMembersLoading(true);
            try {
                const response = await getClubMembers(clubId);
                const membersData = response.data || [];

                // 현재 로그인한 사용자 ID 가져오기 (sessionStorage 또는 localStorage 사용)
                const loggedInUserId = Number(sessionStorage.getItem("userId") || localStorage.getItem("userId"));

                console.log("현재 로그인한 사용자 ID:", loggedInUserId);
                console.log("멤버 데이터:", membersData);

                // 각 멤버의 프로필 정보 가져오기
                const membersWithProfile = await Promise.all(
                    membersData.map(async (member) => {
                        try {
                            const userProfile = await getParticularUserProfile(member.userId);
                            return {
                                ...member,
                                profileImage: userProfile.data.profileImage,
                                username: userProfile.data.username,
                                isCurrentUser: member.userId === loggedInUserId
                            };
                        } catch (error) {
                            console.error(`사용자 ${member.userId} 프로필 불러오기 실패:`, error);
                            return { ...member, profileImage: "/default-profile.png", username: "알 수 없음", isCurrentUser: member.userId === loggedInUserId };
                        }
                    })
                );

                setMembers(membersWithProfile);
                setCurrentUserId(loggedInUserId);
            } catch (error) {
                console.error("멤버 목록을 불러오지 못했습니다.", error);
            } finally {
                setMembersLoading(false);
            }
        };

        fetchMembers();
    }, [clubId]);

    useEffect(() => {
        if (currentUserId !== null) {
            if (roleLoading) return;

            setRoleLoading(true);

            fetchUserRole(currentUserId);
        }
    }, [currentUserId]);

    const fetchUserRole = async (userId) => {
        const role = await getUserClubRole(clubId);
        setCurrentUserRole(role);
        setRoleLoading(false);
    };

    // 역할 변경 핸들러
    const handleRoleChange = async (userId, newRole, username) => {
        if (actionLoading) return;
        console.log(`현재 사용자 ID: ${currentUserId}, 변경 대상 ID: ${userId}`);

        if (currentUserRole !== "PRESIDENT") {
            alert("회장만 역할을 변경할 수 있습니다.");
            return;
        }

        if ((userId ?? 0) === (currentUserId ?? 0)) {
            alert("자기 자신의 역할은 변경할 수 없습니다.");
            return;
        }

        const roleLabel = newRole === "PRESIDENT" ? "회장" : newRole === "VICE_PRESIDENT" ? "부회장" : newRole === "STAFF" ? "임원" : "회원";

        const confirmed = window.confirm(`${username}님을 ${roleLabel}으로 임명하시겠습니까?`);
        if (!confirmed) return;

        setActionLoading(true);
        try {
            const message = await grantRole(userId, clubId, newRole);
            alert(message);

            // 본인이 회장을 넘겼다면, 내 역할을 "MEMBER"로 갱신 + members 목록도 갱신
            if (newRole === "PRESIDENT" && userId !== currentUserId) {
                setCurrentUserRole("MEMBER");

                setMembers((prevMembers) =>
                    prevMembers.map((member) =>
                        member.userId === userId
                            ? { ...member, roleName: newRole } // 새 회장
                            : member.userId === currentUserId
                                ? { ...member, roleName: "MEMBER" } // 나 → MEMBER
                                : member
                    )
                );

                window.location.reload(); // 화면 새로고침
                return; // 아래 코드 실행하지 않음
            }

            // 그 외 경우 (회장 외 다른 역할 변경 시)
            setMembers((prevMembers) =>
                prevMembers.map((member) =>
                    member.userId === userId ? { ...member, roleName: newRole } : member
                )
            );

        } catch (error) {
            console.error("역할 변경 실패:", error);
            alert("역할 변경에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
    };

    // 강퇴 핸들러
    const handleRemoveMember = async (userId, username) => {
        if (actionLoading) return;

        if (currentUserRole !== "PRESIDENT") {
            alert("회장만 회원을 강퇴할 수 있습니다.");
            return;
        }

        const confirmed = window.confirm(`${username}님을 강퇴하시겠습니까?`);
        if (!confirmed) return;

        setActionLoading(true);
        try {
            const message = await leaveClub(userId, clubId);
            alert(message);

            setMembers((prevMembers) => prevMembers.filter((member) => member.userId !== userId));
        } catch (error) {
            console.error("강퇴 실패:", error);
            alert("강퇴에 실패했습니다.");
        } finally {
            setActionLoading(false);
        }
    };

    if (membersLoading || roleLoading) {
        return <Spinner />;
    }

    return (
        <div className="w-full max-w-5xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">권한 관리</h2>
            <div className="divide-y divide-gray-300">
                {members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between py-4">
                        {/* 프로필 사진과 이름 */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border">
                                <ProtectedImage objectName={member.profileImage} alt="User"
                                                className="w-full h-full object-cover"/>
                            </div>
                            <span className="text-lg font-medium">
                                {member.name} (ID: {member.username})
                            </span>
                        </div>

                        {/* 역할 선택 버튼 */}
                        <div className="flex gap-2">
                            {["MEMBER", "STAFF", "VICE_PRESIDENT", "PRESIDENT"].map((role) => (
                                <button
                                    key={role}
                                    className={`px-3 py-1 rounded-lg ${
                                        member.roleName === role ? "bg-primary text-white" : "border"
                                    }`}
                                    onClick={() => handleRoleChange(member.userId, role, member.username)}
                                    disabled={currentUserRole !== "PRESIDENT" || member.isCurrentUser}
                                >
                                    {role === "MEMBER" ? "회원" :
                                        role === "STAFF" ? "임원" :
                                            role === "VICE_PRESIDENT" ? "부회장" : "회장"}
                                </button>
                            ))}
                            <button
                                className={`px-3 py-1 rounded-lg ${
                                    member.roleName === "PRESIDENT" || currentUserRole === "VICE_PRESIDENT"
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-warningButton text-white hover:bg-hoverWarningButton"
                                }`}
                                onClick={() => handleRemoveMember(member.userId, member.username)}
                                disabled={member.roleName === "PRESIDENT" || currentUserRole !== "PRESIDENT"}
                            >
                                강퇴
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClubMembers;



