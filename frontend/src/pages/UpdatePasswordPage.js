import { useLocation } from "react-router-dom";
import MainLogoForm from "../components/MainLogoForm";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";

function UpdatePasswordPage() {
    const location = useLocation();
    const universityName = location.state?.universityName || "";
    const username = location.state?.username || "";

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <MainLogoForm/>
                <h2 className="text-lg font-bold text-center text-gray-500 mb-4">이메일 인증을 먼저 인증해주세요!</h2>
                <UpdatePasswordForm universityName={universityName} username={username}/>
            </div>
        </div>
    );
}
export default UpdatePasswordPage