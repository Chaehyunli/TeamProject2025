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
import UserList from "./pages/UserList";
import MyChatPage from "./pages/MyChatPage";
import ChatLayout from "./layouts/ChatLayout";
import StompChatPage from "./pages/StompChatPage";
import TestPage from "./pages/TestPage";
import HeaderComponent from "./components/HeaderComponents";

function App() {
    return (
        <Router>
            <HeaderComponent />
            {/*<TopNavbar />*/}
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/club-registration" element={<UnderConstruction />} />
                <Route path="/chatrooms" element={<UnderConstruction />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/updateProfile" element={<UpdateProfilePage />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account/find" element={<FindAccountPage />} />
                <Route path="/account/reset-pw" element={<ResetPasswordPage />} />

                {/*Chatting*/}
                <Route path="/user/list" element={<UserList />} />
                <Route path="/my/chat/page" element={<MyChatPage />} />

                {/* ✅ 채팅 관련 페이지는 ChatLayout을 통해 감싼다 */}
                <Route path="/chatpage" element={<ChatLayout />}>
                    <Route path=":roomId" element={<StompChatPage />} />
                </Route>

                {/* ✅ 테스트 페이지 라우트 설정 */}
                <Route path="/test" element={<TestPage />} />
            </Routes>
        </Router>
    );
}

export default App;
