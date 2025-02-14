import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import EmailVerificationForm from "./components/EmailVerificationForm";

function App() {
  return (
      <Router>
        <TopNavbar />
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register" element={<EmailVerificationForm />} /> {/* 추후 변경, 회원가입 페이지로 */}
        </Routes>
      </Router>
  );
}

export default App;
