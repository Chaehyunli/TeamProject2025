import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMySubmissionDetail, getParticularUserProfile } from "../api/userApi";
import InputField from "../components/InputField";
import dayjs from "dayjs";
import Spinner from "../components/Spinner";

const MySubmissionsDetailPage = () => {
    const { applyId } = useParams();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [nameLoading, setNameLoading] = useState(false);

    useEffect(() => {
        const fetchSubmissionDetail = async () => {
            setLoading(true);
            try {
                const response = await getMySubmissionDetail(applyId);
                setSubmission(response.data);
            } catch (error) {
                console.error("내 지원서 상세 정보를 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissionDetail();
    }, [applyId]);

    // submission이 설정된 후 userId로 이름 가져오기
    useEffect(() => {
        if (submission && submission.userId) {
            const fetchUserName = async () => {
                setNameLoading(true);
                try {
                    const userResponse = await getParticularUserProfile(submission.userId);
                    if (userResponse && userResponse.data) {
                        setName(userResponse.data.name || `사용자 ${submission.userId}`);
                    }
                } catch (error) {
                    console.error(`사용자 ${submission.userId}의 정보를 불러오지 못했습니다.`, error);
                } finally {
                    setNameLoading(false);
                }
            };

            fetchUserName();
        }
    }, [submission]);

    if (loading) {
        return <Spinner />;
    }

    if (!submission) {
        return <p className="text-warningText font-semibold mt-4 text-center">지원서 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="flex justify-center items-start">
            <div className="w-[500px] p-6 bg-white shadow-lg rounded-lg mt-28">
                <h2 className="text-2xl font-semibold text-center mb-6">나의 지원서 상세 정보</h2>

                <form className="flex flex-col space-y-4">
                    {/* 동아리 이름 */}
                    <InputField label="동아리 이름" type="text" value={submission.clubName} disabled={true}/>

                    {/* 지원자 이름 */}
                    <InputField label="이름" type="text" value={nameLoading ? "불러오는 중..." : name} disabled={true} />

                    {/* 학번 */}
                    <InputField label="학번" type="text" value={submission.studentId} disabled={true}/>

                    {/* 전화번호 */}
                    <InputField label="전화번호" type="text" value={submission.contact || "미입력"} disabled={true}/>

                    {/* 학과 */}
                    <InputField label="학과" type="text" value={submission.department} disabled={true}/>

                    {/* 지원 동기 */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">지원 동기</label>
                        <textarea
                            value={submission.contents}
                            className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-0 h-40 resize-none border-0"
                            disabled
                        />
                    </div>

                    {/* 지원 상태 */}
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

                    {/* 지원 시간 */}
                    <InputField label="지원 시간" type="text"
                                value={dayjs(submission.createdAt).format("YYYY-MM-DD HH:mm:ss")} disabled={true}/>

                    {/* 수정하기 버튼 */}
                    <button
                        type="button"
                        onClick={() => navigate(`/users/submissions/${applyId}/edit`)} // 수정 페이지로 이동
                        className="mt-4 w-full bg-primary hover:bg-hoverBlueColor text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        지원서 수정하기
                    </button>

                </form>
            </div>
        </div>
    );
};

export default MySubmissionsDetailPage;


