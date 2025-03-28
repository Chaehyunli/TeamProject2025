import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserClubs, getClubList } from "../api/clubApi";
import ClubList from "../components/ClubList";
import { DEFAULT_CLUB_THUMBNAIL } from "../constants/DefaultImage";

const MyClubsPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [userClubs, setUserClubs] = useState([]);
    const [allClubs, setAllClubs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!username) {
            navigate("/login");
            return;
        }

        const fetchUserClubs = async () => {
            setLoading(true);
            try {
                const userClubData = await getUserClubs(); // 사용자의 동아리 목록 가져오기
                setUserClubs(userClubData);
            } catch (error) {
                console.error("사용자의 동아리 목록 불러오기 실패:", error);
                setUserClubs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserClubs();
    }, [username, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-8 lg:px-16">
            <div className="w-full h-48 bg-cover bg-center rounded-lg shadow-md mb-6 mt-24"
                 style={{ backgroundImage: "url('/banner.png')" }}>
                <div className="flex items-center justify-center h-full rounded-lg">
                    <h1 className="text-white text-3xl font-bold">내 동아리 목록</h1>
                </div>
            </div>

            <ClubList clubs={userClubs} userClubs={userClubs} />
        </div>
    );
};

export default MyClubsPage;

