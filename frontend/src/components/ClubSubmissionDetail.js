import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClubSubmissionDetail } from "../api/clubApi"; // API 함수 호출
import InputField from "./InputField"; // 기존 폼에서 사용한 InputField 컴포넌트
import dayjs from "dayjs"; // 날짜 변환 라이브러리 -> 지원 시간 및 최근 업데이트 시간을 형식에 맞게 출력 -> "npm install dayjs" 라이브러리 설치 필요

const ClubSubmissionDetail = () => {
    const { clubId, applyId } = useParams(); // 경로 변수 가져오기
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissionDetail = async () => {
            try {
                const response = await getClubSubmissionDetail(clubId, applyId);
                setSubmission(response.data);
            } catch (error) {
                console.error("지원서 상세 정보를 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissionDetail();
    }, [clubId, applyId]);

    if (loading) {
        return <p className="text-gray-500 mt-4 text-center">로딩 중...</p>;
    }

    if (!submission) {
        return <p className="text-red-500 font-semibold mt-4 text-center">지원서 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="flex justify-center items-start">
            <div className="w-[500px] p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center">지원서 상세 정보</h2>
                <p className="text-sm text-gray-500">동아리 ID: {clubId}</p> {/* 이후에 특정 동아리 조회 API 추가되면 동아리 이름 표시 */}

                <form className="flex flex-col space-y-4">
                    {/* 사용자 ID (이후 프로필 조회 API 추가되면 사용자 이름으로 변경) */}
                    <InputField label="이름 (사용자 ID)" type="text" value={`사용자 ID: ${submission.userId}`} disabled={true} />

                    {/* 학번 */}
                    <InputField label="학번" type="text" value={submission.studentId} disabled={true} />

                    {/* 전화번호 */}
                    <InputField label="전화번호" type="text" value={submission.contact || "미입력"} disabled={true} />

                    {/* 학과 */}
                    <InputField label="학과" type="text" value={submission.department} disabled={true} />

                    {/* 지원 동기 */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">지원 동기</label>
                        <textarea
                            value={submission.contents}
                            className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-0 h-40 resize-none border-0"
                            disabled
                        />
                    </div>

                    {/* 지원 시간 */}
                    <InputField label="지원 시간" type="text" value={dayjs(submission.createdAt).format("YYYY-MM-DD HH:mm:ss")} disabled={true} />

                    {/* 최근 수정 시간 */}
                    <InputField label="최근 업데이트 시간" type="text" value={dayjs(submission.updatedAt).format("YYYY-MM-DD HH:mm:ss")} disabled={true} />
                </form>
            </div>
        </div>
    );
};

export default ClubSubmissionDetail;

