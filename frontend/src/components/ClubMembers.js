import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClubMembers } from "../api/clubApi";
import { ProtectedImage } from "../api/uploadApi";
import { getParticularUserProfile } from "../api/userApi";

const ClubMembers = () => {
    const { clubId } = useParams();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await getClubMembers(clubId);
                const membersData = response.data || [];

                // 각 멤버의 프로필 정보 가져오기
                const membersWithProfile = await Promise.all(
                    membersData.map(async (member) => {
                        try {
                            const userProfile = await getParticularUserProfile(member.userId);
                            return {
                                ...member,
                                profileImage: userProfile.data.profileImage,
                                username: userProfile.data.username // API에서 name 필드 사용
                            };
                        } catch (error) {
                            console.error(`사용자 ${member.userId} 프로필 불러오기 실패:`, error);
                            return { ...member, profileImage: "/default-profile.png", username: "알 수 없음" };
                        }
                    })
                );

                setMembers(membersWithProfile);
            } catch (error) {
                console.error("멤버 목록을 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [clubId]);

    if (loading) return <p className="text-center mt-10">⏳ 로딩 중...</p>;

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
                                    {member.name}(ID: {member.username})
                            </span>
                        </div>

                        {/* 역할 선택 버튼 */}
                        <div className="flex gap-2">
                            {["MEMBER", "STAFF", "VICE_PRESIDENT", "PRESIDENT"].map((role) => (
                                <button
                                    key={role}
                                    className={`px-3 py-1 rounded-lg ${
                                        member.roleName === role ? "bg-blue-500 text-white" : "border"
                                    }`}
                                    // onClick={() => handleRoleChange(member.userId, role)}
                                >
                                    {role === "MEMBER" ? "회원" :
                                        role === "STAFF" ? "임원" :
                                            role === "VICE_PRESIDENT" ? "부회장" : "회장"}
                                </button>
                            ))}
                            <button
                                className={`px-3 py-1 rounded-lg ${
                                    member.roleName === "PRESIDENT"
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" // 회장은 회색으로 변경 & 클릭 방지
                                        : "bg-red-500 text-white hover:bg-red-600"
                                }`}
                                disabled={member.role === "PRESIDENT"} // 회장은 클릭 불가능
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