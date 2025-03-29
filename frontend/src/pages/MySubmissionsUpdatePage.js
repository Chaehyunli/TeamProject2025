import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMySubmissionDetail, updateMySubmission } from "../api/userApi";
import InputField from "../components/InputField";
import dayjs from "dayjs";

const MySubmissionsUpdatePage = () => {
    const { applyId } = useParams();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contact, setContact] = useState("");
    const [contents, setContents] = useState("");
    const [updating, setUpdating] = useState(false);

    // 기존 값 저장 (비교용)
    const [originalContact, setOriginalContact] = useState("");
    const [originalContents, setOriginalContents] = useState("");

    useEffect(() => {
        const fetchSubmissionDetail = async () => {
            try {
                const response = await getMySubmissionDetail(applyId);
                setSubmission(response.data);
                setContact(response.data.contact || "");
                setContents(response.data.contents || "");

                // 기존 데이터 저장
                setOriginalContact(response.data.contact || "");
                setOriginalContents(response.data.contents || "");
            } catch (error) {
                console.error("내 지원서 상세 정보를 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissionDetail();
    }, [applyId]);

    // 🔹 PATCH 요청 함수
    const handleUpdate = async (e) => {
        e.preventDefault();

        // 변경 사항이 없는 경우 업데이트 방지
        if (contact === originalContact && contents === originalContents) {
            alert("변경 사항이 없습니다.");
            navigate(`/users/submissions/${applyId}`);
            return;
        }

        setUpdating(true);

        try {
            await updateMySubmission(applyId, { contact, contents });
            alert("지원서가 성공적으로 수정되었습니다.");
            navigate(`/users/submissions/${applyId}`);
        } catch (error) {
            console.error("지원서 수정 중 오류 발생:", error);
            alert("지원서 수정에 실패했습니다.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <p className="text-gray-500 mt-4 text-center">로딩 중...</p>;
    }

    if (!submission) {
        return <p className="text-warningText font-semibold mt-4 text-center">지원서 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="flex justify-center items-start">
            <div className="w-[500px] p-6 bg-white shadow-lg rounded-lg mt-20">
                <h2 className="text-2xl font-semibold text-center">지원서 수정</h2>
                <p className="text-sm text-gray-500">지원서 ID: {applyId}</p>

                <form className="flex flex-col space-y-4" onSubmit={handleUpdate}>
                    {/* 동아리 이름 (변경 불가) */}
                    <InputField label="동아리 이름" type="text" value={submission.clubName} disabled={true} />

                    {/* 학번 (변경 불가) */}
                    <InputField label="학번" type="text" value={submission.studentId} disabled={true} />

                    {/* 전화번호 (변경 가능) */}
                    <InputField
                        label="전화번호"
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />

                    {/* 학과 (변경 불가) */}
                    <InputField label="학과" type="text" value={submission.department} disabled={true} />

                    {/* 지원 동기 (변경 가능) */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">지원 동기</label>
                        <textarea
                            value={contents}
                            onChange={(e) => setContents(e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-0 h-40 resize-none border border-gray-300"
                        />
                    </div>

                    {/* 지원 상태 (변경 불가) */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">지원 상태</label>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-lg 
                            ${submission.status === "PENDING"
                            ? "bg-pendingColor text-white"
                            : submission.status === "APPROVED"
                                ? "bg-approvedTrueColor text-white"
                                : "bg-approvedFalseColor text-white"}`}>
                            {submission.status === "PENDING"
                                ? "심사 중"
                                : submission.status === "APPROVED"
                                    ? "합격"
                                    : "불합격"}
                        </span>
                    </div>

                    {/* 지원 시간 (변경 불가) */}
                    <InputField label="지원 시간" type="text"
                                value={dayjs(submission.createdAt).format("YYYY-MM-DD HH:mm:ss")} disabled={true}/>

                    {/* 수정 완료 버튼 */}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-primary hover:bg-hoverBlueColor text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        disabled={updating}
                    >
                        {updating ? "수정 중..." : "수정 완료"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MySubmissionsUpdatePage;



