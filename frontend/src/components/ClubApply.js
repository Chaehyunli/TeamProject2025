import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitClubApplication, getUserClubSubmissionStatus } from "../api/clubApi";
import { getUserProfile } from "../api/userApi";
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

            // 동아리 이름 가져오기
            //  특정 동아리 조회 api 추가 이후

            // 사용자 정보 가져와 학번 & 학과 자동 입력
            const userData = await getUserProfile();
            if (userData && userData.data) {
                setFormData((prevData) => ({
                    ...prevData,
                    studentId: userData.data.studentId || "",
                    department: userData.data.department || "",
                }));
            }

            // 사용자가 이미 지원했는지 확인
            const applied = await getUserClubSubmissionStatus(clubId);
            setHasApplied(applied);

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
        <div className="flex justify-center items-start py-10">
            <div className="w-[500px] p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center">동아리 지원하기</h2>
                <p className="text-sm text-gray-500">동아리 ID: {clubId}</p> {/* 이후에 특정 동아리 조회 api 추가되면 동아리 이름 표시*/}

                {loading ? (
                    <p className="text-gray-500 mt-4 text-center">로딩 중...</p>
                ) : hasApplied ? (
                    <p className="text-red-500 font-semibold mt-4 text-center">이미 지원하였습니다.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        {/* 학번 - 자동 입력, 수정 불가 */}
                        <InputField label="학번" type="text" name="studentId" value={formData.studentId} disabled={true} />

                        {/* 전화번호 */}
                        <InputField label="전화번호" type="text" name="contact" value={formData.contact} onChange={handleChange} required />

                        {/* 학과 - 자동 입력, 수정 불가 */}
                        <InputField label="학과" type="text" name="department" value={formData.department} disabled={true} />

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
                        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">
                            지원하기
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClubApply;









