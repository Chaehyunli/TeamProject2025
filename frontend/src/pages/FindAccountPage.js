import { useState } from "react";
import MainLogoForm from "../components/MainLogoForm";
import FindAccountOptionForm from "../components/FindAccountOptionForm";
import FindIdForm from "../components/FindIdForm";
import FindPasswordForm from "../components/FindPasswordForm";

function FindAccountPage() {
    const [activeTab, setActiveTab] = useState("id"); // "id" 또는 "pw" 저장

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <MainLogoForm />
                <FindAccountOptionForm activeTab={activeTab} setActiveTab={setActiveTab} />
                {activeTab === "id" ? <FindIdForm /> : <FindPasswordForm />}
            </div>
        </div>
    );
}

export default FindAccountPage