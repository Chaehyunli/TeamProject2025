import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { getClubList, getUserClubs } from "../api/clubApi";
import ClubList from "../components/ClubList";
import BannerHeader from "../components/BannerHeader";

const HomePage = () => {
    const navigate = useNavigate();
    const [username] = useState(localStorage.getItem("username"));
    const [clubs, setClubs] = useState([]);
    const [userClubs, setUserClubs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userClubsLoading, setUserClubsLoading] = useState(false);

    const { ref, inView } = useInView();

    const fetchClubs = useCallback( async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try{
            const limit = 12;
            const offset = (page - 1) * limit;

            const clubData = await getClubList(limit, offset);
            if (clubData.length === 0) {
                setHasMore(false);
            } else {
                setClubs(prev => [...prev, ...clubData]);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.log("동아리 목록 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    const fetchUserClubs = async () => {
        setUserClubsLoading(true);

        try {
            const userClubData = await getUserClubs(); // 사용자의 동아리 목록 요청
            setUserClubs(userClubData); // userClubs 상태 업데이트
        } catch (error) {
            console.error("사용자의 동아리 목록 불러오기 실패:", error);
            setUserClubs([]); // 오류 발생 시 빈 배열로 설정
        } finally {
            setUserClubsLoading(false);
        }
    };

    useEffect(() => {
        if (!username) {
            // 로그인 정보가 없으면 로그인 페이지로 이동
            navigate("/login");
            return;
        }

        if (page === 1) fetchClubs(); // 첫페이지 로딩
        fetchUserClubs();
    }, [username]);

    useEffect(() => {
        if (inView && hasMore && !loading){
            fetchClubs(); // 마지막 요소 보이면 다음 페이지 불러옴
        }
    }, [inView])

    return (
        <div className="container mx-auto px-8 lg:px-16">
            <BannerHeader imageUrl="/banner.png" title="동아리를 찾아보세요!" />

            { clubs.length === 0 ? (
                // 동아리가 없을 때 메시지 표시
                <div className="text-center mt-10">
                    <p className="text-lg text-gray-600">아직 등록된 동아리가 없습니다.</p>
                    <p className="text-xl font-semibold text-gray-800 mt-2">
                        🏆 <span className="text-primary">최초의 동아리 등록자가 되어보세요!</span>
                    </p>
                    <button
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-hoverBlueColor"
                        onClick={() => navigate("/club-register")}
                    >
                        동아리 등록하기
                    </button>
                </div>
            ) : (
                // 동아리가 있는 경우 목록 표시
                <>
                    <ClubList clubs={clubs} userClubs={userClubs} userClubsLoading={userClubsLoading} />
                    { hasMore && (
                        <div ref={ref} className="text-center py-4">
                            <span className="text-extraText">불러오는 중...</span>
                        </div>
                    ) }
                </>
            )}
        </div>
    );
};

export default HomePage;
