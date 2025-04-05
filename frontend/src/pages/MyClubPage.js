import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserClubs, getClubList } from "../api/clubApi";
import ClubList from "../components/ClubList";
import { DEFAULT_CLUB_THUMBNAIL } from "../constants/DefaultImage";
import BannerHeader from "../components/BannerHeader";
import Spinner from "../components/Spinner";

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
        return <Spinner />;
    }

    return (
        <div className="container mx-auto px-8 lg:px-16">
            <BannerHeader imageUrl="/banner.png" title="나의 동아리 목록" />

            <ClubList clubs={userClubs} userClubs={userClubs} />
        </div>
    );
};

export default MyClubsPage;

