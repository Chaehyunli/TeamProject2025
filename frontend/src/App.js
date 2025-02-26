import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import UnderConstruction from "./components/UnderConstruction";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FindAccountPage from "./pages/FindAccountPage";
import ClubRegisterPage from "./pages/ClubRegisterPage";
import ClubDetailPage from "./pages/ClubDetailPage";
import ClubArticles from "./components/ClubArticles";
import ClubNotices from "./components/ClubNotices";
import ClubSubmissions from "./components/ClubSubmissions";
import ClubMembers from "./components/ClubMembers";
import ClubApply from "./components/ClubApply";
import ClubSubmissionDetail from "./components/ClubSubmissionDetail";
import MySubmissionsPage from "./pages/MySubmissionsPage";

function App() {

    return (
        <Router>
            <TopNavbar />
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/club-register" element={<ClubRegisterPage />} />
                <Route path="/chatrooms" element={<UnderConstruction />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/updateProfile" element={<UpdateProfilePage />} />
                <Route path="/mySubmissions" element={<MySubmissionsPage />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account/find" element={<FindAccountPage />} />
                <Route path="/account/reset-pw" element={<ResetPasswordPage />} />

                {/* Club */}
                <Route path="/clubs/:clubId" element={<ClubDetailPage />}> {/* ClubDetailNavbar에서 누른 것에 따라 Outlet되어 렌더링*/}
                    <Route index element={<Navigate to="articles" replace />} />  {/* 기본 경로는 게시물 */}
                    <Route path="articles" element={<ClubArticles />} /> {/* 게시물 */}
                    <Route path="notices" element={<ClubNotices />} /> {/* 공지사항 */}
                    <Route path="submissions" element={<ClubSubmissions />} /> {/* 지원자 관리 */}
                    <Route path="submissions/:applyId" element={<ClubSubmissionDetail />} /> {/* 지원서 상세 페이지 관리 */}
                    <Route path="members" element={<ClubMembers />} /> {/* 권한 */}
                    <Route path="apply" element={<ClubApply />} />  {/* 동아리 지원하기 */}
                </Route>

            </Routes>
        </Router>
    );
}

export default App;