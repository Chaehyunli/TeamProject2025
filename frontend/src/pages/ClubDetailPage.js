import ClubDetailNavbar from "../components/ClubDetailNavbar";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getUserClubRole, getClub, updateClubThumbnail, resetClubThumbnail,deleteClub } from "../api/clubApi";
import { ProtectedImage, uploadImageToGCP } from "../api/uploadApi";
import DirectMessageButton from "../components/DirectMessageButton";
import { FaEdit } from "react-icons/fa"; // ✏️ 아이콘 추가

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const [club, setClub] = useState(null); // 동아리 정보
    const [userRole, setUserRole] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showOptions, setShowOptions] = useState(false); // 썸네일 수정 옵션 표시 여부
    const fileInputRef = useRef(null); // 파일 입력창을 트리거하기 위한 ref
    const dropdownRef = useRef(null); // 드롭다운 위치 조정용
    const navigate = useNavigate();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [defaultUploading, setDefaultUploading] = useState(false);

    const fetchClubData = async () => {
        try {
            const [clubData, role] = await Promise.all([
                getClub(clubId),
                getUserClubRole(clubId)
            ]);

            setClub(clubData);
            setUserRole(role);
        } catch (error) {
            console.error("❌ 동아리 정보를 불러오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchClubData();
    }, [clubId]);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!club) {
        return <div className="text-center text-warningText py-10">❌ 동아리 정보를 불러올 수 없습니다.</div>;
    }

    // 회장 및 부회장 정보 가져오기
    const president = club.leaders?.find(leader => leader.roleName === "PRESIDENT");
    const vicePresident = club.leaders?.find(leader => leader.roleName === "VICE_PRESIDENT");

    // 썸네일 변경 핸들러
    const handleThumbnailChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (uploading) return;

        setUploading(true);
        try {
            const objectName = await uploadImageToGCP(file);
            await updateClubThumbnail(clubId, objectName);
            setClub({ ...club, thumbUrl: objectName });
            setShowOptions(false); // 옵션 창 닫기
        } catch (error) {
            console.error("썸네일 업로드 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    // 기본 썸네일로 변경
    const handleResetThumbnail = async () => {
        if (club.thumbUrl === "default-thumbnail-mju.png") {
            alert("이미 기본 이미지입니다."); // 이미 기본 이미지라면 알림만 표시하고 종료
            return;
        }

        if(!window.confirm("정말 기본 이미지로 설정하시겠습니까?")) return;

        if (defaultUploading) return;

        setDefaultUploading(true);
        try {
            await resetClubThumbnail(clubId);

            setClub((prevClub) => ({
                ...prevClub,
                thumbUrl: "default-thumbnail-mju.png",
            }));

            setShowOptions(false);
        } catch (error) {
            console.error("❌ 기본 썸네일 설정 실패:", error);
        } finally {
            setDefaultUploading(false);
        }
    };

    // 파일 선택창 열기 (버튼 클릭 시 실행)
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 동아리 삭제
    const handleDeleteClub = async () => {
        if (!window.confirm("정말로 동아리를 삭제하시겠습니까? 회원이 없는 상태여야 합니다.")) return;

        if (deleteLoading) return;

        setDeleteLoading(true);
        try {
            await deleteClub(clubId);
            alert("동아리가 삭제되었습니다.");
            navigate("/home"); // 삭제 후 동아리 목록으로 이동
        } catch (error) {
            alert(error.response?.data?.message || "❌ 삭제에 실패했습니다.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-4 pt-14">
            {/* 동아리 기본 정보 (배경 이미지 포함) */}
            <div className="relative bg-white shadow-md rounded-lg my-6 overflow-hidden">
                {club.thumbUrl && (
                    <div className="relative w-full h-60">
                        <ProtectedImage objectName={club.thumbUrl} alt="Club Thumbnail"
                                        className="w-full h-full object-cover opacity-90" />

                        {/* 🖊️ 연필 아이콘 수정 (onClick 이벤트 확인) */}
                        {(userRole === "PRESIDENT" || userRole === "VICE_PRESIDENT") && (
                            <div className="absolute bottom-4 right-4 flex z-10">
                                <button
                                    className="bg-white p-2 rounded-full shadow-md cursor-pointer flex items-center justify-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowOptions((prev) => !prev);
                                    }}
                                    style={{ cursor: "pointer", zIndex: 50 }} // 클릭 가능하게 스타일 적용
                                >
                                    <FaEdit className="text-gray-700 w-5 h-5" />
                                </button>

                                {/* 썸네일 수정 옵션 드롭다운 */}
                                {showOptions && (
                                    <div ref={dropdownRef} className="absolute bottom-12 right-0 bg-white shadow-lg rounded-md p-2 z-10"
                                         style={{ minWidth: "150px", whiteSpace: "nowrap" }}
                                    >
                                        <button
                                            className="block px-4 py-2 text-sm text-extraText hover:bg-gray-200 w-full text-left"
                                            onClick={handleButtonClick}
                                        >
                                            이미지 수정
                                        </button>
                                        <button
                                            className="block px-4 py-2 text-sm text-extraText hover:bg-gray-200 w-full text-left"
                                            onClick={handleResetThumbnail}
                                        >
                                            기본 이미지로 설정
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 숨겨진 파일 입력 */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleThumbnailChange}
                        />

                        {/* 오버레이 및 텍스트 */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start text-white text-left pl-8">
                            <h1 className="text-3xl font-bold">{club.clubName}</h1>

                            {/* 회장 및 부회장 정보 */}
                            <div className="flex gap-2 mt-1">
                                <p className="text-lg text-gray-200">
                                    <strong>회장:</strong> {president ? president.name : "미정"}
                                </p>
                                {vicePresident && (
                                    <p className="text-lg text-gray-200">
                                        <strong>부회장:</strong> {vicePresident.name}
                                    </p>
                                )}
                            </div>

                            <DirectMessageButton
                                presidentId={president.userId}
                                receiverName={president.name}
                                clubId={clubId}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 네비게이션 바 */}
            <div className="mt-6">
                <ClubDetailNavbar clubId={clubId} userRole={userRole} onDeleteClub={handleDeleteClub} />
            </div>

            {/* 본문: Outlet을 통해 페이지 변경 */}
            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
};

export default ClubDetailPage;
