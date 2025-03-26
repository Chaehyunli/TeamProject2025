import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ClubSearchResultPage from "./pages/ClubSearchResultPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPasswordForm from "./components/ResetPasswordForm";
import EmailVerificationForm from "./components/EmailVerificationForm";
import FindPasswordForm from "./components/FindPasswordForm";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";

import CreateNotice from "./components/CreateNotice";
import NoticeList from "./components/NoitceList";
import NoticeDetail from "./components/NoticeDetail";

function App() {
    return (
        <Router>
            <TopNavbar />
            <Routes>
                {/* 로그인 필수 페이지 */}
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><ClubSearchResultPage /></ProtectedRoute>} />
                <Route path="/club-register" element={<ProtectedRoute><ClubRegisterPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/updateProfile" element={<ProtectedRoute><UpdateProfilePage /></ProtectedRoute>} />
                <Route path="/users/submissions" element={<ProtectedRoute><MySubmissionsPage /></ProtectedRoute>} />
                <Route path="/users/submissions/:applyId" element={<ProtectedRoute><MySubmissionsDetailPage /></ProtectedRoute>} />
                <Route path="/users/submissions/:applyId/edit" element={<ProtectedRoute><MySubmissionsUpdatePage /></ProtectedRoute>} />
                <Route path="/myclub" element={<ProtectedRoute><MyClubsPage /></ProtectedRoute>} />
                <Route path="/profile/update-pw" element={<ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>} />

                {/* 로그인 불필요 페이지 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account/find" element={<FindAccountPage />} />
                <Route path="/account/reset-pw" element={<ResetPasswordPage />} />

                {/* 채팅 관련 페이지 - 로그인 필수 */}
                <Route path="/chat/userlist" element={<ProtectedRoute><UserChatList /></ProtectedRoute>} />
                <Route path="/my-chatpage" element={<ProtectedRoute><MyChatPage /></ProtectedRoute>} />

                {/* 채팅 Layout 적용 */}
                <Route path="/chatpage" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
                    <Route path=":roomId" element={<ProtectedRoute><StompChatPage /></ProtectedRoute>} />
                </Route>

                {/* 테스트 페이지 */}
                <Route path="/test/chat" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
                <Route path="/test/reset-pw" element={<ProtectedRoute><ResetPasswordPage /></ProtectedRoute>} />
                <Route path="/test/find-pw" element={<ProtectedRoute><FindPasswordForm/></ProtectedRoute>} />

                {/* 동아리 관련 페이지 */}
                <Route path="/clubs/:clubId" element={<ProtectedRoute><ClubDetailPage /></ProtectedRoute>}>
                    <Route index element={<Navigate to="articles" replace />} />
                    <Route path="articles" element={<ProtectedRoute><ClubArticlesList /></ProtectedRoute>} />
                    <Route path="submissions" element={<ProtectedRoute><ClubSubmissions /></ProtectedRoute>} />
                    <Route path="submissions/:applyId" element={<ProtectedRoute><ClubSubmissionDetail /></ProtectedRoute>} />
                    <Route path="members" element={<ProtectedRoute><ClubMembers /></ProtectedRoute>} />
                    <Route path="apply" element={<ProtectedRoute><ClubApply /></ProtectedRoute>} />
                    <Route path="/clubs/:clubId/articles/create" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
                    <Route path="articles/:articleId" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
                    <Route path="/clubs/:clubId/articles/:articleId/delete" element={<ProtectedRoute><DeleteArticle /></ProtectedRoute>} />
                    <Route path="/clubs/:clubId/articles/:articleId/edit" element={<ProtectedRoute><UpdateArticle /></ProtectedRoute>} />
                    <Route path="notices/create" element={<CreateNotice />} />
                    <Route path="notices" element={<NoticeList />} />
                    <Route path="notices/:noticeId" element={<NoticeDetail />} />
                    <Route path="notices/:noticeId/delete" element={<DeleteArticle />} />

                </Route>

            </Routes>
        </Router>
    );
}

export default App;
