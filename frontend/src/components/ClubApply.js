import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitClubApplication, getUserClubSubmissionStatus, approveSubmission } from "../api/clubApi";
import { getUserProfile } from "../api/userApi";
import { getClub } from "../api/clubApi";
import InputField from "../components/InputField";

const ClubApply = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [clubName, setClubName] = useState("");
    const [formData, setFormData] = useState({
        studentId: "",
        contact: "",
        department: "",
        contents: "",
    });

    const [hasApplied, setHasApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // 사용자가 이미 지원했는지 확인
                const applied = await getUserClubSubmissionStatus(clubId);
                setHasApplied(applied);

                if (applied) {
                    setLoading(false);
                    return; // 이미 지원한 상태라면 다른 API 호출을 하지 않음
                }

                // 특정 동아리 정보 조회 API를 통해 동아리 이름 가져오기
                const clubData = await getClub(clubId);
                setClubName(clubData.data.clubName || "알 수 없음");

                // 사용자 정보 가져와 학번 & 학과 자동 입력
                const userData = await getUserProfile();
                if (userData && userData.data) {
                    setFormData((prevData) => ({
                        ...prevData,
                        studentId: userData.data.studentId || "",
                        department: userData.data.department || "",
                    }));
                }
            } catch (error) {
                console.error("data 불러오기 실패: ", error);
            }

            setLoading(false);
        };

        fetchData();
    }, [clubId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitClubApplication(clubId, formData);
            alert("지원서 제출 성공!");
            navigate(`/clubs/${clubId}/articles`); // 지원 후 이동
        } catch (error) {
            alert("지원서 제출에 실패했습니다.");
        }
    };

    return (
        <div className="flex justify-center items-start py-12 ">
            <div className="w-[500px] mx-auto px-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center my-8">{clubName} 동아리 지원하기</h2>

                {loading ? (
                    <p className="text-gray-500 mt-4 text-center">로딩 중...</p>
                ) : hasApplied ? (
                    <p className="text-red-500 font-semibold mt-4 text-center">이미 지원하였습니다.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        {/* 학번 - 자동 입력, 수정 불가 */}
                        <InputField label="학번" type="text" name="studentId" value={formData.studentId} disabled={true}/>

                        {/* 전화번호 */}
                        <InputField label="전화번호" type="text" name="contact" value={formData.contact}
                                    onChange={handleChange} required/>

                        {/* 학과 - 자동 입력, 수정 불가 */}
                        <InputField
                            label="학과"
                            type="text"
                            name="department"
                            value={formData.department ? formData.department : "학과 미입력"}
                            disabled={true}
                        />

                        {!formData.department && (
                            <p className="text-sm text-gray-500 mt-1">내 정보에서 학과를 입력해주세요</p>
                        )}

                        {/* 지원동기 */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">지원동기</label>
                            <textarea
                                name="contents"
                                value={formData.contents}
                                onChange={handleChange}
                                placeholder="지원동기를 입력하세요."
                                className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-0 h-40 resize-none border-0"
                                required
                            />
                        </div>

                        {/* 지원하기 버튼 */}
                        <button type="submit"
                                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">
                            지원하기
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClubApply;
