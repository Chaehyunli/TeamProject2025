import React from "react";
import { useParams } from "react-router-dom";

const MySubmissionsUpdatePage = () => {
    const { applyId } = useParams();

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-[500px] p-6 bg-white shadow-lg rounded-lg mt-10">
                <h2 className="text-2xl font-semibold text-center mb-4">내 지원서 수정하기</h2>
                <p className="text-gray-600 text-center">지원서 ID: {applyId}</p>
            </div>
        </div>
    );
};

export default MySubmissionsUpdatePage;

