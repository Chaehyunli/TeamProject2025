import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClubSubmissions, approveSubmission, rejectSubmission, getUserClubRole } from "../api/clubApi";
import { ProtectedImage } from "../api/uploadApi";
import {getParticularUserProfile} from "../api/userApi";

const ClubSubmissions = () => {
    const { clubId } = useParams(); // URL에서 동아리 ID 가져오기
    const [submissions, setSubmissions] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (loading) return;

            setLoading(true);
            try {
                // 로그인한 사용자의 역할 가져오기
                const role = await getUserClubRole(clubId);
                setUserRole(role);

                if (role === "PRESIDENT" || role === "VICE_PRESIDENT") {
                    // 지원자 목록 가져오기
                    const response = await getClubSubmissions(clubId);
                    const submissionsData = response.data || [];

                    // 지원자의 프로필 정보를 가져와서 profileImage ㄱ밧 설정
                    const submissionsWithProfile = await Promise.all(
                        submissionsData.map(async (applicant) => {
                            try {
                                const userProfile = await getParticularUserProfile(applicant.userId);
                                return {
                                    ...applicant,
                                    username: userProfile.data.username,
                                    name: userProfile.data.name,
                                    profileImage: userProfile.data.profileImage
                                };
                            } catch (error) {
                                console.error(`사용자 ${applicant.userId} 프로필 불러오기 실패:`, error);
                                return {
                                    ...applicant,
                                    name: `사용자 ${applicant.userId}`,
                                };
                            }
                        })
                    );

                    setSubmissions(submissionsWithProfile);
                }
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [clubId]);

    const handleApprove = async (applicant) => {
        if (actionLoading) return;

        const { name, username, applyId } = applicant;
        const isConfirmed = window.confirm(`${name}(ID: ${username}) 님을 합격시키겠습니까?`);
        if (!isConfirmed) return;

        setActionLoading(true);
        try {
            await approveSubmission(clubId, applyId);
            alert(`${name}(ID: ${username}) 님의 승인 완료되었습니다.`);
            navigate(`/clubs/${clubId}/articles`);
        } catch (error) {
            alert("승인 처리 중 오류가 발생했습니다.");
            console.error("승인 오류:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (applicant) => {
        if (actionLoading) return;

        const { name, username, applyId } = applicant;
        const isConfirmed = window.confirm(`${name}(ID: ${username}) 님을 불합격시키겠습니까?`);
        if (!isConfirmed) return;

        setActionLoading(true);
        try {
            await rejectSubmission(clubId, applyId);
            alert(`${name}(ID: ${username}) 님의 거절이 완료되었습니다.`);
            navigate(`/clubs/${clubId}/articles`);
        } catch (error) {
            alert("거절 처리 중 오류가 발생했습니다.");
            console.error("거절 오류:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!userRole || (userRole !== "PRESIDENT" && userRole !== "VICE_PRESIDENT")) {
        return <p className="text-center mt-10 text-red-500 text-xl">⚠️ 권한이 없습니다.</p>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">지원자 관리</h2>
            <div className="divide-y divide-gray-300">
                {submissions.length > 0 ? (
                    submissions.map((applicant) => (
                        <div key={applicant.applyId} className="flex items-center justify-between py-4">
                            {/* 프로필 사진과 이름 */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border">
                                    <ProtectedImage objectName={applicant.profileImage} alt="User"
                                                    className="w-full h-full object-cover"/>
                                </div>
                                <span className="text-lg font-medium">
                                    {applicant.name}(ID: {applicant.username})
                                </span>
                            </div>

                            {/* 지원서 보기, 합격, 불합격 버튼 */}
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1 border rounded-lg"
                                    onClick={() => navigate(`/clubs/${clubId}/submissions/${applicant.applyId}`)}
                                >
                                    지원서 보기
                                </button>

                                <button
                                    disabled={actionLoading}
                                    className={`px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                                        actionLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    onClick={() => handleApprove(applicant)}
                                >
                                    합격
                                </button>
                                {/* 이후에 userid 이름 가져오는 api 추가 후에 이름으로 변경 */}
                                <button
                                    className={`px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 ${
                                        actionLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    onClick={() => handleReject(applicant)}
                                >
                                    불합격
                                </button>
                                {/* 이후에 userid 이름 가져오는 api 추가후에 이름으로 변경 */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-4">아직 지원자가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default ClubSubmissions;