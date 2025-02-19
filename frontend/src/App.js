import React from "react";
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
import ClubPosts from "./components/ClubPosts";
import ClubNotices from "./components/ClubNotices";
import ClubApplicants from "./components/ClubApplicants";
import ClubPermissions from "./components/ClubPermissions";
import ClubApply from "./components/ClubApply";

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

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account/find" element={<FindAccountPage />} />
                <Route path="/account/reset-pw" element={<ResetPasswordPage />} />

                {/* Club */}
                <Route path="/clubs/:clubId" element={<ClubDetailPage />}> {/* ClubDetailNavbar에서 누른 것에 따라 Outlet되어 렌더링*/}
                    <Route index element={<ClubPosts />} />  {/* 기본 경로는 게시물 */}
                    <Route path="notices" element={<ClubNotices />} />
                    <Route path="applicants" element={<ClubApplicants />} />
                    <Route path="permissions" element={<ClubPermissions />} />
                    <Route path="apply" element={<ClubApply />} />
                </Route>

            </Routes>
        </Router>
    );
}

export default App;