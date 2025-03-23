import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 로그인 상태 확인
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            navigate("/home", { replace: true }); // replace: 뒤로가기 방지
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">로그인</h2>
                <LoginForm/>
                <div className="flex justify-between text-sm mt-3 text-gray-600">
                    <span className="hover:text-hoverBlueColor transition cursor-pointer" onClick={() => navigate("/account/find")}>
                        아이디/비밀번호 찾기
                    </span>
                    <span className="hover:text-hoverBlueColor transition cursor-pointer" onClick={() => navigate("/register")}>
                        회원가입
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
