import FindPasswordForm from "../components/FindPasswordForm";
import FindAccountOptionForm from "../components/FindAccountOptionForm";
import MainLogoForm from "../components/MainLogoForm";

function FindPasswordPage() {
    // const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <MainLogoForm/>
                <FindAccountOptionForm/>
                <FindPasswordForm/>
            </div>
        </div>
    );
}

export default FindPasswordPage;
