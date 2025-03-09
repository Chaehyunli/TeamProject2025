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
import UserChatList from "./pages/UserChatList";
import MyChatPage from "./pages/MyChatPage";
import ChatLayout from "./layouts/ChatLayout";
import StompChatPage from "./pages/StompChatPage";
import TestPage from "./pages/TestPage";
import HeaderComponent from "./components/HeaderComponents";
import ClubRegisterPage from "./pages/ClubRegisterPage";
import ClubDetailPage from "./pages/ClubDetailPage";
import ClubArticlesList from "./components/ClubArticlesList";
import ClubSubmissions from "./components/ClubSubmissions";
import ClubMembers from "./components/ClubMembers";
import ClubApply from "./components/ClubApply";
import ClubSubmissionDetail from "./components/ClubSubmissionDetail";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import MySubmissionsDetailPage from "./pages/MySubmissionsDetailPage";
import MySubmissionsUpdatePage from "./pages/MySubmissionsUpdatePage";
import MyClubsPage from "./pages/MyClubPage";
import CreateArticle from "./components/CreateArticle";
import ArticleDetail from "./components/ArticleDetail";
import DeleteArticle from "./components/DeleteArticle";
import UpdateArticle from "./components/UpdateArticle";

function App() {

    return (
        <Router>
            {/*<HeaderComponent />*/}
            <TopNavbar />
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/club-register" element={<ClubRegisterPage />} />
                <Route path="/chatrooms" element={<UnderConstruction />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/updateProfile" element={<UpdateProfilePage />} />
                <Route path="/users/submissions" element={<MySubmissionsPage />} />
                <Route path="/users/submissions/:applyId" element={<MySubmissionsDetailPage />} />
                <Route path="/users/submissions/:applyId/edit" element={<MySubmissionsUpdatePage />} />
                <Route path="/myclub" element={<MyClubsPage />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account/find" element={<FindAccountPage />} />
                <Route path="/account/reset-pw" element={<ResetPasswordPage />} />

                {/*Chatting*/}
                <Route path="/chat/userlist" element={<UserChatList />} />
                <Route path="/my-chatpage" element={<MyChatPage />} />

                {/* ✅ 채팅 관련 페이지는 ChatLayout을 통해 감싼다 */}
                <Route path="/chatpage" element={<ChatLayout />}>
                    <Route path=":roomId" element={<StompChatPage />} />
                </Route>

                {/* ✅ 테스트 페이지 라우트 설정 */}
                <Route path="/chat/test" element={<TestPage />} />

                {/* Club */}
                <Route path="/clubs/:clubId" element={<ClubDetailPage />}> {/* ClubDetailNavbar에서 누른 것에 따라 Outlet되어 렌더링*/}
                    <Route index element={<Navigate to="articles" replace />} />  {/* 기본 경로는 게시물 */}
                    <Route path="articles" element={<ClubArticlesList />} /> {/* 게시물 */}
                    <Route path="submissions" element={<ClubSubmissions />} /> {/* 지원자 관리 */}
                    <Route path="submissions/:applyId" element={<ClubSubmissionDetail />} /> {/* 지원서 상세 페이지 관리 */}
                    <Route path="members" element={<ClubMembers />} /> {/* 권한 */}
                    <Route path="apply" element={<ClubApply />} />  {/* 동아리 지원하기 */}
                    <Route path="/clubs/:clubId/articles/create" element={<CreateArticle />} /> {/* 게시글 작성 */}
                    <Route path="articles/:articleId" element={<ArticleDetail />} />
                    <Route path="/clubs/:clubId/articles/:articleId/delete" element={<DeleteArticle />} />
                    <Route path="/clubs/:clubId/articles/:articleId/edit" element={<UpdateArticle />} />

                </Route>

            </Routes>
        </Router>
    );
}

export default App;