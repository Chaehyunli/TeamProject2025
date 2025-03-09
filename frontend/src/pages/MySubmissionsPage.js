import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubmissions, deleteMySubmission } from "../api/userApi";

const MySubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await getMySubmissions(); // 내 지원서 목록 조회 API 호출
                setSubmissions(response.data || []);
            } catch (error) {
                console.error("지원서 목록을 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    // 지원서 삭제 함수
    const handleDelete = async (applyId) => {
        if (!window.confirm("정말 이 지원서를 삭제하시겠습니까?")) return;

        setDeleting(true);
        try {
            await deleteMySubmission(applyId); // 삭제 API 호출
            setSubmissions(submissions.filter(submission => submission.applyId !== applyId)); // 목록에서 제거
            alert("지원서가 삭제되었습니다.");
        } catch (error) {
            console.error("지원서 삭제 실패:", error);
            alert("지원서 삭제에 실패했습니다.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <p className="text-center mt-10">⏳ 로딩 중...</p>;

    return (
        <div className="w-full max-w-4xl mx-auto pt-28 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">나의 지원서 목록</h2>

            {submissions.length > 0 ? (
                <div className="divide-y divide-gray-300">
                    {submissions.map((submission) => (
                        <div key={submission.applyId} className="flex items-center justify-between py-4">
                            {/* 지원 정보 */}
                            <div>
                                <p className="text-lg font-medium">{submission.clubName}</p>
                                <p className="text-gray-600 text-sm">지원일: {submission.createdAt}</p>
                                <p className="text-gray-600 text-sm">최근 수정일: {submission.updatedAt}</p>
                            </div>

                            {/* 버튼 & 상태 */}
                            <div className="flex items-center gap-4">
                                {/* 내 지원서 삭제 버튼 */}
                                <button
                                    className="px-3 py-1 border rounded-lg text-red-500 hover:bg-red-100 transition"
                                    onClick={() => handleDelete(submission.applyId)}
                                    disabled={deleting} // 삭제 중이면 비활성화
                                >
                                    {deleting ? "삭제 중..." : "삭제"}
                                </button>
                                {/* 내 지원서 보기 버튼 */}
                                <button
                                    className="px-3 py-1 border rounded-lg text-blue-500 hover:bg-blue-100 transition"
                                    onClick={() => navigate(`/users/submissions/${submission.applyId}`)}
                                >
                                    내 지원서 보기
                                </button>

                                {/* 지원 상태 */}
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                                        submission.status === "PENDING"
                                            ? "bg-yellow-500 text-white"
                                            : submission.status === "APPROVED"
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                    }`}
                                >
                                    {submission.status === "PENDING"
                                        ? "심사 중"
                                        : submission.status === "APPROVED"
                                            ? "합격"
                                            : "불합격"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-4">현재 제출한 지원서가 없습니다.</p>
            )}
        </div>
    );
};

export default MySubmissionsPage;


