import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import UnderConstruction from "./components/UnderConstruction";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import FindPasswordPage from "./pages/FindPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
    return (
        <Router>
            <TopNavbar />
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
                <Route path="/account/find" element={<UnderConstruction />} />
                <Route path="/account/find/pw" element={<FindPasswordPage />} />
                <Route path="/account/reset-pw" element={<ResetPasswordPage />} />
            </Routes>
        </Router>
    );
}

export default App;
