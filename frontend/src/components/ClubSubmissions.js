import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { getClubSubmissions, approveSubmission, rejectSubmission, getUserClubRole } from "../api/clubApi";

const ClubSubmissions = () => {
    const { clubId } = useParams(); // URL에서 동아리 ID 가져오기
    const [submissions, setSubmissions] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 로그인한 사용자의 역할 가져오기
                const role = await getUserClubRole(clubId);
                setUserRole(role);

                if (role === "PRESIDENT" || role === "VICE_PRESIDENT") {
                    // 지원자 목록 가져오기
                    const response = await getClubSubmissions(clubId);
                    setSubmissions(response.data || []);
                }
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [clubId]);

    const handleApprove = async (userId) => {
        const isConfirmed = window.confirm(`${userId} 님을 합격시키겠습니까?`);
        if (!isConfirmed) return;

        try {
            await approveSubmission(clubId, userId);
            alert("승인 완료되었습니다.");
            navigate(`/clubs/${clubId}/articles`)
        } catch (error) {
            alert("승인 처리 중 오류가 발생했습니다.");
            console.error("승인 오류:", error);
        }
    };

    const handleReject = async (userId) => {
        const isConfirmed = window.confirm(`${userId} 님을 불합격시키겠습니까?`);
        if (!isConfirmed) return;

        try {
            await rejectSubmission(clubId, userId);
            alert("거절 완료되었습니다.");
            navigate(`/clubs/${clubId}/articles`)
        } catch (error) {
            alert("거절 처리 중 오류가 발생했습니다.");
            console.error("거절 오류:", error);
        }
    };


    if (loading) return <p className="text-center mt-10">⏳ 로딩 중...</p>;
    if (!userRole || (userRole !== "PRESIDENT" && userRole !== "VICE_PRESIDENT")) {
        return <p className="text-center mt-10 text-red-500 text-xl">⚠️ 권한이 없습니다.</p>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">지원자 관리</h2>
            <p className="text-sm text-gray-500">동아리 ID: {clubId}</p>
            <div className="divide-y divide-gray-300">
                {submissions.length > 0 ? (
                    submissions.map((applicant) => (
                        <div key={applicant.applyId} className="flex items-center justify-between py-4">
                            {/* 프로필 사진과 이름 */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={applicant.profileImage || "/default-profile.png"}
                                    alt="프로필"
                                    className="w-12 h-12 rounded-full border"
                                />
                                <span className="text-lg font-medium">
                                    사용자 ID : {applicant.userId} {/* 사용자 ID 표시, 이후에 userid로 특정 사용자의 프로필 조회 api 추가시 이름으로 대체 */}
                                </span>
                                <span className="text-lg font-medium">
                                    지원서 ID : {applicant.applyId} {/* 지원서 ID 표시 */}
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
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    onClick={() => handleApprove(applicant.userId)}
                                >
                                    합격
                                </button>
                                {/* 이후에 userid 이름 가져오는 api 추가 후에 이름으로 변경 */}
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    onClick={() => handleReject(applicant.userId)}
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
