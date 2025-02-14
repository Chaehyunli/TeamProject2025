import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import UnderConstruction from "./components/UnderConstruction";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setIsLoggedIn(true);
        }
    }, []);

  return (
      <Router>
        <TopNavbar />
        <Routes>
            {/* TopNavBar */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/club-registration" element={isLoggedIn ? <UnderConstruction /> : <Navigate to="/login" />} /> {/* 추후 변경, 동아리 등록 페이지로 */}
            <Route path="/chatrooms" element={isLoggedIn ? <UnderConstruction /> : <Navigate to="/login" />} /> {/* 추후 변경, 채팅 페이지로 */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> {/* 추후 변경, 회원가입 페이지로 */}
            <Route path="/account/find" element={<UnderConstruction />} /> {/* 추후 변경, 아이디 및 비번 찾기 페이지로 */}
        </Routes>
      </Router>
  );
}

export default App;
