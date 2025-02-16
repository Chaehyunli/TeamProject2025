import FindAccountOptionForm from "../components/FindAccountOptionForm";

function fuckPage() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">테스트</h2>
                <FindAccountOptionForm/>
            </div>
        </div>
    );
}

export default fuckPage;
