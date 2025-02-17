import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">회원가입</h2>
                <RegisterForm/>
                <div className="font-medium flex justify-center text-gray-500 mt-4 gap-2">
                    <span className="font-medium text-gray-500">계정이 이미 있으신가요?</span>
                    <span
                        className="hover:text-hoverBlueColor underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        로그인
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;