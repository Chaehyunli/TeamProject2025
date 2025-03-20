import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const username = localStorage.getItem("username");

    if (!username) {
        return <Navigate to="/login" replace />;  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    }

    return children;
};

export default ProtectedRoute;
