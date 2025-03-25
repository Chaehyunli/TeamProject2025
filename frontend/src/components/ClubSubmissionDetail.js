import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClubSubmissionDetail, getClub } from "../api/clubApi";
import { getParticularUserProfile } from "../api/userApi";
import InputField from "./InputField"; // 기존 폼에서 사용한 InputField 컴포넌트
import dayjs from "dayjs"; // 날짜 변환 라이브러리 -> 지원 시간 및 최근 업데이트 시간을 형식에 맞게 출력 -> "npm install dayjs" 라이브러리 설치 필요

const ClubSubmissionDetail = () => {
    const { clubId, applyId } = useParams(); // 경로 변수 가져오기
    const [submission, setSubmission] = useState(null);
    const [name, setName] = useState("");
    const [clubName, setClubName] = useState("");
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        const fetchSubmissionDetail = async () => {
            if (submissionLoading) return;

            setSubmissionLoading(true);
            try {
                const response = await getClubSubmissionDetail(clubId, applyId);
                setSubmission(response.data);

                const clubResponse = await getClub(clubId);
                setClubName(clubResponse.clubName || "알 수 없음");
            } catch (error) {
                console.error("지원서 상세 정보를 불러오지 못했습니다.", error);
            } finally {
                setSubmissionLoading(false);
            }
        };

        fetchSubmissionDetail();
    }, [clubId, applyId]);

    // submission이 설정된 후에 userId 가져오기
    useEffect(() => {
        if (submission && submission.userId) {
            const fetchUserProfile = async () => {
                if (profileLoading) return;

                setProfileLoading(true);
                try {
                    const userResponse = await getParticularUserProfile(submission.userId);
                    if (userResponse && userResponse.data) {
                        setName(userResponse.data.name || `사용자 ${submission.userId}`);
                    }
                } catch (error) {
                    console.error(`사용자 ${submission.userId} 프로필 정보를 불러오지 못했습니다.`, error);
                } finally {
                    setProfileLoading(false);
                }
            };

            fetchUserProfile();
        }
    }, [submission]);

    if (profileLoading || submissionLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!submission) {
        return <p className="text-red-500 font-semibold mt-4 text-center">지원서 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="flex justify-center items-start">
            <div className="w-[500px] p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center mb-6">지원서 상세 정보</h2>

                <form className="flex flex-col space-y-4">
                    {/* 사용자 ID (이후 프로필 조회 API 추가되면 사용자 이름으로 변경) */}
                    <InputField label="이름" type="text" value={name} disabled={true} />

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

